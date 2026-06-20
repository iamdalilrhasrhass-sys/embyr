#!/usr/bin/env python3
from __future__ import annotations

import argparse
import asyncio
import csv
import html
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable


DEFAULT_BASE_URL = "https://embir.xyz"
DEFAULT_OUTPUT_DIR = Path("seo-reports")
DEFAULT_LIMIT = 40
USER_AGENT = "embir-crawl4ai-seo-audit/1.0"


@dataclass
class PageAudit:
    url: str
    status: int
    title: str
    description: str
    h1: str
    h2_count: int
    canonical: str
    noindex: bool
    word_count: int
    internal_links: list[str]
    markdown: str


def strip_tags(value: str) -> str:
    text = re.sub(r"<script\b[^>]*>.*?</script>", " ", value, flags=re.I | re.S)
    text = re.sub(r"<style\b[^>]*>.*?</style>", " ", text, flags=re.I | re.S)
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def extract_first(pattern: str, source: str) -> str:
    match = re.search(pattern, source, flags=re.I | re.S)
    if not match:
      return ""
    return strip_tags(match.group(1))


def extract_meta_description(source: str) -> str:
    patterns = [
        r"<meta[^>]+name=[\"']description[\"'][^>]+content=[\"']([^\"']*)[\"'][^>]*>",
        r"<meta[^>]+content=[\"']([^\"']*)[\"'][^>]+name=[\"']description[\"'][^>]*>",
    ]
    for pattern in patterns:
        value = extract_first(pattern, source)
        if value:
            return value
    return ""


def extract_canonical(source: str) -> str:
    patterns = [
        r"<link[^>]+rel=[\"']canonical[\"'][^>]+href=[\"']([^\"']*)[\"'][^>]*>",
        r"<link[^>]+href=[\"']([^\"']*)[\"'][^>]+rel=[\"']canonical[\"'][^>]*>",
    ]
    for pattern in patterns:
        value = extract_first(pattern, source)
        if value:
            return value
    return ""


def normalize_url(base_url: str, href: str) -> str | None:
    href = href.strip()
    if not href or href.startswith(("#", "mailto:", "tel:", "javascript:")):
        return None
    absolute = urllib.parse.urljoin(base_url, href)
    parsed = urllib.parse.urlparse(absolute)
    if parsed.netloc != urllib.parse.urlparse(DEFAULT_BASE_URL).netloc:
        return None
    clean = parsed._replace(fragment="", query="").geturl()
    return clean.rstrip("/") if clean != DEFAULT_BASE_URL else clean


def extract_internal_links(base_url: str, source: str) -> list[str]:
    links: list[str] = []
    for href in re.findall(r"<a\b[^>]+href=[\"']([^\"']+)[\"']", source, flags=re.I):
        normalized = normalize_url(base_url, html.unescape(href))
        if normalized and normalized not in links:
            links.append(normalized)
    return links


def summarize_page(url: str, source: str, markdown: str, status: int = 200) -> PageAudit:
    body_text = strip_tags(source)
    words = re.findall(r"\b[\w'-]+\b", body_text, flags=re.UNICODE)
    robots_values = re.findall(
        r"<meta[^>]+name=[\"']robots[\"'][^>]+content=[\"']([^\"']*)[\"'][^>]*>",
        source,
        flags=re.I,
    )
    return PageAudit(
        url=url,
        status=status,
        title=extract_first(r"<title>(.*?)</title>", source),
        description=extract_meta_description(source),
        h1=extract_first(r"<h1\b[^>]*>(.*?)</h1>", source),
        h2_count=len(re.findall(r"<h2\b", source, flags=re.I)),
        canonical=extract_canonical(source),
        noindex=any("noindex" in value.lower() for value in robots_values),
        word_count=len(words),
        internal_links=extract_internal_links(DEFAULT_BASE_URL, source),
        markdown=markdown.strip() or body_text[:5000],
    )


def fetch_url(url: str) -> tuple[int, str]:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            charset = response.headers.get_content_charset() or "utf-8"
            return response.status, response.read().decode(charset, errors="replace")
    except urllib.error.HTTPError as error:
        return error.code, error.read().decode("utf-8", errors="replace")


def parse_sitemap(xml_text: str, limit: int) -> list[str]:
    root = ET.fromstring(xml_text)
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [item.text for item in root.findall(".//sm:loc", namespace) if item.text]
    return urls[:limit]


async def crawl_with_crawl4ai(url: str) -> tuple[int, str, str]:
    from crawl4ai import AsyncWebCrawler

    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(url=url)
        html_source = getattr(result, "html", "") or ""
        markdown = getattr(result, "markdown", "") or ""
        status = int(getattr(result, "status_code", 200) or 200)
        return status, html_source, markdown


async def audit_url(url: str, use_crawl4ai: bool) -> PageAudit:
    if use_crawl4ai:
        try:
            status, source, markdown = await crawl_with_crawl4ai(url)
            return summarize_page(url, source, markdown, status)
        except Exception as error:
            print(f"[crawl4ai fallback] {url}: {error}", file=sys.stderr)

    status, source = fetch_url(url)
    return summarize_page(url, source, "", status)


async def crawl_urls(urls: Iterable[str], use_crawl4ai: bool) -> list[PageAudit]:
    audits: list[PageAudit] = []
    for url in urls:
        audits.append(await audit_url(url, use_crawl4ai))
    return audits


def build_reports(audits: list[PageAudit], output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "crawl-urls.json").write_text(
        json.dumps([audit.url for audit in audits], indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    (output_dir / "crawl-content.json").write_text(
        json.dumps([asdict(audit) for audit in audits], indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    with (output_dir / "pages-audited.csv").open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(
            file,
            fieldnames=[
                "url",
                "status",
                "title",
                "description",
                "h1",
                "h2_count",
                "canonical",
                "noindex",
                "word_count",
                "internal_link_count",
            ],
        )
        writer.writeheader()
        for audit in audits:
            writer.writerow({
                "url": audit.url,
                "status": audit.status,
                "title": audit.title,
                "description": audit.description,
                "h1": audit.h1,
                "h2_count": audit.h2_count,
                "canonical": audit.canonical,
                "noindex": audit.noindex,
                "word_count": audit.word_count,
                "internal_link_count": len(audit.internal_links),
            })

    thin_pages = [audit for audit in audits if audit.word_count < 180 or not audit.h1 or not audit.title]
    thin_lines = ["# Thin Content Report", ""]
    if not thin_pages:
        thin_lines.append("No thin pages detected in the crawled sample.")
    for audit in thin_pages:
        thin_lines.append(f"- `{audit.url}` — {audit.word_count} words, h1={bool(audit.h1)}, title={bool(audit.title)}")
    (output_dir / "thin-content-report.md").write_text("\n".join(thin_lines) + "\n", encoding="utf-8")

    linking_lines = ["# Internal Linking Report", ""]
    for audit in audits:
        count = len(audit.internal_links)
        if count < 3:
            linking_lines.append(f"- `{audit.url}` — {count} internal links")
    if len(linking_lines) == 2:
        linking_lines.append("All crawled pages have at least 3 internal links.")
    (output_dir / "internal-linking-report.md").write_text("\n".join(linking_lines) + "\n", encoding="utf-8")


async def main() -> int:
    parser = argparse.ArgumentParser(description="Crawl Embir pages and generate SEO reports.")
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL)
    parser.add_argument("--limit", type=int, default=DEFAULT_LIMIT)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--no-crawl4ai", action="store_true", help="Use plain HTTP fallback instead of Crawl4AI.")
    args = parser.parse_args()

    sitemap_status, sitemap_xml = fetch_url(f"{args.base_url.rstrip('/')}/sitemap.xml")
    if sitemap_status != 200:
        raise RuntimeError(f"sitemap returned HTTP {sitemap_status}")

    urls = parse_sitemap(sitemap_xml, args.limit)
    audits = await crawl_urls(urls, use_crawl4ai=not args.no_crawl4ai)
    build_reports(audits, args.output_dir)
    print(json.dumps({
        "baseUrl": args.base_url,
        "urlsCrawled": len(audits),
        "outputDir": str(args.output_dir),
        "thinPages": sum(1 for audit in audits if audit.word_count < 180),
        "noindexPages": [audit.url for audit in audits if audit.noindex],
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
