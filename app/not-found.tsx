import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-surface border border-border rounded-2xl p-8 text-center space-y-4">
        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
          Error 404
        </div>
        <h1 className="text-xl font-bold text-text">Page not found</h1>
        <p className="text-sm text-text-muted leading-relaxed">
          The page or application record you requested does not exist.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
