import { readFileSync } from "fs";
import Link from "next/link";

// Read and render markdown content
function MDContent({ filePath }: { filePath: string }) {
  try {
    const raw = readFileSync(filePath, "utf-8");
    // Split frontmatter (first --- block) from content
    const parts = raw.split("---");
    const body = parts.length >= 3 ? parts.slice(2).join("---").trim() : raw;
    
    // Simple markdown-to-HTML conversion for common elements
    let html = body
      // Headings
      .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold text-white mt-8 mb-3">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-white mt-10 mb-4">$1</h2>')
      // Bold and italic
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white/90">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-white/80 hover:text-white underline underline-offset-2">$1</a>')
      // Lists
      .replace(/^- (.+)$/gm, '<li class="ml-4 text-white/50">$1</li>')
      .replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul class="list-disc my-4 space-y-1">$1</ul>')
      // Paragraphs (double newlines)
      .replace(/\n\n/g, '</p><p class="text-white/50 leading-relaxed mb-4">')
      // Single newlines to <br>
      .replace(/\n(?!\s*<)/g, '<br/>');

    html = '<p class="text-white/50 leading-relaxed mb-4">' + html + '</p>';

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  } catch {
    return <p className="text-white/50">Article not found.</p>;
  }
}

export function BlogArticle({ slug }: { slug: string }) {
  return (
    <main className="emb-page min-h-screen">
      <article className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-3xl mx-auto">
          <Link href="/blog" className="text-white/30 hover:text-white/60 text-sm mb-8 inline-block transition-colors">
            ← Back to blog
          </Link>
          <div className="prose prose-invert max-w-none">
            <MDContent filePath={`/root/embir/content/blog/${slug}.md`} />
          </div>
          <div className="mt-16 pt-8 border-t border-white/[0.06]">
            <p className="text-white/30 text-sm mb-4">Published on Embir Blog</p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Create your free profile on Embir
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
