import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto py-16 text-center space-y-4">
      <h2 className="text-2xl font-bold text-white">404 - Page Not Found</h2>
      <p className="text-xs text-slate-400">The requested page could not be located.</p>
      <Link
        href="/"
        className="inline-block px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl"
      >
        Return to Home Dashboard
      </Link>
    </div>
  );
}
