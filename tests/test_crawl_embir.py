import csv
import json
import tempfile
import unittest
from pathlib import Path

from scripts.seo.crawl_embir import (
    PageAudit,
    build_reports,
    extract_internal_links,
    summarize_page,
)


class CrawlEmbirReportTests(unittest.TestCase):
    def test_summarize_page_extracts_core_seo_fields(self):
        html = """
        <html>
          <head>
            <title>Free dating app | Embir</title>
            <meta name="description" content="Verified profiles and safer dating.">
            <meta name="robots" content="index, follow">
            <link rel="canonical" href="https://embir.xyz/free-dating-app">
          </head>
          <body>
            <h1>Free dating app</h1>
            <h2>Verified profiles</h2>
            <a href="/verified-dating-app">Verified dating app</a>
            <a href="https://external.example">External</a>
            <p>Embir helps people meet with verified profiles, compatibility and clear intentions.</p>
          </body>
        </html>
        """

        audit = summarize_page("https://embir.xyz/free-dating-app", html, "markdown body")

        self.assertEqual(audit.url, "https://embir.xyz/free-dating-app")
        self.assertEqual(audit.title, "Free dating app | Embir")
        self.assertEqual(audit.description, "Verified profiles and safer dating.")
        self.assertEqual(audit.h1, "Free dating app")
        self.assertEqual(audit.h2_count, 1)
        self.assertEqual(audit.canonical, "https://embir.xyz/free-dating-app")
        self.assertFalse(audit.noindex)
        self.assertIn("https://embir.xyz/verified-dating-app", audit.internal_links)

    def test_extract_internal_links_normalizes_same_site_urls(self):
        html = """
        <a href="/fr">FR</a>
        <a href="https://embir.xyz/us">US</a>
        <a href="https://other.example/page">Other</a>
        <a href="#skip">Skip</a>
        <a href="mailto:contact@embir.xyz">Mail</a>
        """

        links = extract_internal_links("https://embir.xyz", html)

        self.assertEqual(links, ["https://embir.xyz/fr", "https://embir.xyz/us"])

    def test_build_reports_writes_expected_artifacts(self):
        audits = [
            PageAudit(
                url="https://embir.xyz",
                status=200,
                title="Home",
                description="Home description",
                h1="Home",
                h2_count=2,
                canonical="https://embir.xyz",
                noindex=False,
                word_count=450,
                internal_links=["https://embir.xyz/fr"],
                markdown="Home markdown",
            ),
            PageAudit(
                url="https://embir.xyz/thin",
                status=200,
                title="Thin",
                description="Short",
                h1="Thin",
                h2_count=0,
                canonical="",
                noindex=False,
                word_count=42,
                internal_links=[],
                markdown="Thin markdown",
            ),
        ]

        with tempfile.TemporaryDirectory() as tmp:
            output_dir = Path(tmp)
            build_reports(audits, output_dir)

            urls = json.loads((output_dir / "crawl-urls.json").read_text())
            content = json.loads((output_dir / "crawl-content.json").read_text())
            with (output_dir / "pages-audited.csv").open() as csv_file:
                csv_rows = list(csv.DictReader(csv_file))
            thin_report = (output_dir / "thin-content-report.md").read_text()
            linking_report = (output_dir / "internal-linking-report.md").read_text()

        self.assertEqual(urls, ["https://embir.xyz", "https://embir.xyz/thin"])
        self.assertEqual(content[0]["title"], "Home")
        self.assertEqual(csv_rows[1]["word_count"], "42")
        self.assertIn("https://embir.xyz/thin", thin_report)
        self.assertIn("0 internal links", linking_report)


if __name__ == "__main__":
    unittest.main()
