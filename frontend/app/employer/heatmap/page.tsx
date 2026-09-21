'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function EmployerHeatmapPage() {
  useEffect(() => {
    redirect('/employer');
  }, []);

  return null;
}
