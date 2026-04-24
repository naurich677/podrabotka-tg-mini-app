'use client';

import { Globe } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';

export function SelectLanguageScreen() {
  const { language, setLanguage, navigateTo } = useAppStore();

  const handleSelectLang = (lang: 'ru' | 'kz') => {
    setLanguage(lang);
    navigateTo('selectRole');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--tg-bg-color)] px-6 py-12">
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-[var(--tg-button-color)]/10 flex items-center justify-center mb-2">
          <Globe className="w-8 h-8 text-[var(--tg-button-color)]" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--tg-text-color)]">
          {t(language, 'selectLanguage.title')}
        </h1>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">
        <Card
          className="cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] border-2 border-transparent hover:border-[var(--tg-button-color)]"
          onClick={() => handleSelectLang('ru')}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl shrink-0">
              🇷🇺
            </div>
            <span className="text-xl font-semibold text-[var(--tg-text-color)]">
              {t(language, 'selectLanguage.ru')}
            </span>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] border-2 border-transparent hover:border-[var(--tg-button-color)]"
          onClick={() => handleSelectLang('kz')}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-2xl shrink-0">
              🇰🇿
            </div>
            <span className="text-xl font-semibold text-[var(--tg-text-color)]">
              {t(language, 'selectLanguage.kz')}
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
