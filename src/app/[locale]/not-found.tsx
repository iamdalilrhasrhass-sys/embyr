import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-8xl md:text-9xl font-bold text-white/10 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-3">Page not found</h2>
        <p className="text-white/40 mb-8">
          The page you're looking for doesn't exist or was moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/membres"
            className="rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white hover:bg-white/[0.08] transition-colors"
          >
            Browse members
          </Link>
        </div>
      </div>
    </div>
  );
}
