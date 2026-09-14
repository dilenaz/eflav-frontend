'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function TurnstileWidget({ onVerify, resetKey = 0 }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const callbackRef = useRef(onVerify);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => { callbackRef.current = onVerify; }, [onVerify]);

  useEffect(() => {
    if (!SITE_KEY || !scriptReady || !containerRef.current || !window.turnstile) return;
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: SITE_KEY,
      language: 'tr',
      callback: (token) => callbackRef.current(token),
      'expired-callback': () => callbackRef.current(''),
      'error-callback': () => callbackRef.current(''),
    });
    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [scriptReady]);

  useEffect(() => {
    if (widgetIdRef.current !== null && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      callbackRef.current('');
    }
  }, [resetKey]);

  if (!SITE_KEY) return null;
  return (
    <div className="space-y-2">
      <Script id="cloudflare-turnstile" src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={() => setScriptReady(true)} onError={() => callbackRef.current('')} />
      <div ref={containerRef} aria-label="Robot doğrulaması" />
      <noscript><p className="text-sm text-red-700">Formu göndermek için JavaScript etkin olmalıdır.</p></noscript>
    </div>
  );
}

export const turnstileEnabled = Boolean(SITE_KEY);
