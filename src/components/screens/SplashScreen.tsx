'use client';

import { useEffect } from 'react';
import { Briefcase, Loader2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { api, setInitData } from '@/lib/api';
import { useTelegram } from '@/hooks/use-telegram';

export function SplashScreen() {
  const { language, navigateTo, setUser, setLanguage, setOnboarded } = useAppStore();
  const { isReady, initData } = useTelegram();

  useEffect(() => {
    if (!isReady) return;

    const init = async () => {
      try {
        if (initData) {
          setInitData(initData);
          const response = await api.auth.init(initData);
          const userData = (response as Record<string, unknown>)?.data as Record<string, unknown> | undefined;
          if (userData) {
            const user = {
              id: userData.id as string,
              telegramId: userData.telegramId as number,
              telegramUsername: userData.telegramUsername as string | undefined,
              firstName: userData.firstName as string | undefined,
              lastName: userData.lastName as string | undefined,
              photoUrl: userData.photoUrl as string | undefined,
              role: (userData.role as 'worker' | 'employer') || 'worker',
              phone: userData.phone as string | undefined,
              phoneVerified: (userData.phoneVerified as boolean) || false,
              language: (userData.language as 'ru' | 'kz') || 'ru',
              city: (userData.city as string) || 'Астана',
            };
            setUser(user);
            setLanguage(user.language);

            if (user.phoneVerified && user.role) {
              setOnboarded(true);
              navigateTo(user.role === 'worker' ? 'workerFeed' : 'employerDashboard');
              return;
            }
          }
        }

        // New user or no initData - go to onboarding
        setTimeout(() => {
          navigateTo('selectLanguage');
        }, 1500);
      } catch {
        // On error, still show onboarding
        setTimeout(() => {
          navigateTo('selectLanguage');
        }, 1500);
      }
    };

    init();
  }, [isReady, initData, navigateTo, setUser, setLanguage, setOnboarded]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[var(--tg-button-color)] to-[var(--tg-bg-color)] px-6">
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Briefcase className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">
          {t(language, 'splash.title')}
        </h1>
        <p className="text-white/80 text-center text-base">
          {t(language, 'splash.subtitle')}
        </p>
      </div>
      <div className="mt-12">
        <Loader2 className="w-8 h-8 text-white/60 animate-spin" />
      </div>
    </div>
  );
}
