'use client';

import { useEffect, useState } from 'react';
import API from '@/src/lib/api';
import AdminApp from './AdminApp';

export default function AdminPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      if (!API.requireAuth({ adminRequired: true })) return;
    } finally {
      setReady(true);
    }
  }, []);

  if (!ready) return null;

  return <AdminApp />;
}
