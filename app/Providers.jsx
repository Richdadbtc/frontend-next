'use client';

import { useEffect } from 'react';
import { I18nProvider, useI18n } from '@/src/lib/i18n';

function LangHtmlSync({ children }) {
  const { lang } = useI18n();

  useEffect(() => {
    try {
      document.documentElement.lang = lang || 'en';
    } catch {}
  }, [lang]);

  return children;
}

export default function Providers({ children }) {
  return (
    <I18nProvider>
      <LangHtmlSync>{children}</LangHtmlSync>
    </I18nProvider>
  );
}
