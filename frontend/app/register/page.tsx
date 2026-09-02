'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login?mode=register');
  }, [router]);

  return (
    <div className="max-w-md mx-auto py-24 text-center space-y-4">
      <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-3 animate-pulse">
        <span className="text-xs font-bold">...</span>
      </div>
      <p className="text-xs font-bold text-slate-500">Redirecting to registration portal...</p>
    </div>
  );
}
