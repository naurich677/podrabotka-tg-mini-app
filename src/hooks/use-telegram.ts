'use client';

import { useEffect, useState, startTransition } from 'react';
import { TelegramWebApp } from '@/lib/telegram-types';

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === 'undefined') return null;
  return window.Telegram?.WebApp || null;
}

export function useTelegram() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [initData, setInitData] = useState('');

  useEffect(() => {
    const tg = getTelegramWebApp();
    if (tg) {
      tg.ready();
      tg.expand();
      // Batch updates into a single state transition
      const initDataVal = tg.initData;
      const isDarkVal = tg.colorScheme === 'dark';
      startTransition(() => {
        setWebApp(tg);
        setInitData(initDataVal);
        setIsDark(isDarkVal);
        setIsReady(true);
      });
    } else {
      // Dev mode - simulate Telegram environment
      console.warn('Not running inside Telegram WebApp, using dev mode');
      startTransition(() => {
        setIsReady(true);
        setInitData('');
      });
    }
  }, []);

  return { webApp, isReady, isDark, initData };
}
