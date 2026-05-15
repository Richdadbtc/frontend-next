'use client';

import { useEffect, useState } from 'react';
import API from '@/src/lib/api';
import DashboardApp from './DashboardApp';

export default function DashboardPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      if (!API.requireAuth({ adminRequired: false })) return;
      const me = API.getUser();
      if (me?.role === 'admin') {
        window.location.href = '/admin';
        return;
      }
    } finally {
      setReady(true);
    }
  }, []);

  if (!ready) return null;

  return <DashboardApp />;
}
