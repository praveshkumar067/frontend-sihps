'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [swRegistered, setSwRegistered] = useState<boolean>(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker for PWA support
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => setSwRegistered(true))
        .catch((err) => console.log('ServiceWorker registration failed: ', err));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="bg-amber-500/90 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-lg backdrop-blur-md sticky top-[61px] z-30">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-slate-950 animate-pulse" />
        <span>Offline Mode Active — Changes will sync automatically once connected to Internet.</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="bg-slate-950/20 text-slate-950 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
          PWA Local Cache
        </span>
      </div>
    </div>
  );
};
