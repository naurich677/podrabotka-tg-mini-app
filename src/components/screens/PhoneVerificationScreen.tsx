'use client';

import { useState } from 'react';
import { Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { api } from '@/lib/api';
import { useTelegram } from '@/hooks/use-telegram';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export function PhoneVerificationScreen() {
  const { language, user, setUser, navigateTo, setOnboarded } = useAppStore();
  const { webApp } = useTelegram();
  const [manualPhone, setManualPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [error, setError] = useState('');

  const handleShareViaTelegram = async () => {
    if (!webApp) {
      setShowManual(true);
      return;
    }

    setIsLoading(true);
    webApp.requestContact(async (success, contact) => {
      if (success && contact) {
        try {
          await api.phone.confirm(contact.phone_number);
          if (user) {
            setUser({ ...user, phone: contact.phone_number, phoneVerified: true });
          }
          setOnboarded(true);
          navigateTo(user?.role === 'worker' ? 'workerFeed' : 'employerDashboard');
        } catch {
          setError(t(language, 'common.error'));
        }
      } else {
        setShowManual(true);
      }
      setIsLoading(false);
    });
  };

  const handleManualConfirm = async () => {
    if (!manualPhone.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      await api.phone.confirm(manualPhone);
      if (user) {
        setUser({ ...user, phone: manualPhone, phoneVerified: true });
      }
      setOnboarded(true);
      navigateTo(user?.role === 'worker' ? 'workerFeed' : 'employerDashboard');
    } catch {
      setError(t(language, 'common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    setOnboarded(true);
    navigateTo(user?.role === 'worker' ? 'workerFeed' : 'employerDashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--tg-bg-color)] px-6 py-8">
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-[var(--tg-button-color)]/10 flex items-center justify-center mb-2">
          <Phone className="w-8 h-8 text-[var(--tg-button-color)]" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--tg-text-color)] text-center">
          {t(language, 'phoneVerification.title')}
        </h1>
        <p className="text-[var(--tg-hint-color)] text-center text-sm">
          {t(language, 'phoneVerification.description')}
        </p>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        <Button
          size="lg"
          className="w-full min-h-12 text-base font-semibold bg-[var(--tg-button-color)] hover:bg-[var(--tg-button-color)]/90 text-[var(--tg-button-text-color)]"
          onClick={handleShareViaTelegram}
          disabled={isLoading}
        >
          <Phone className="w-5 h-5 mr-2" />
          {t(language, 'phoneVerification.shareViaTelegram')}
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="w-full min-h-12 text-base font-semibold"
          onClick={() => setShowManual(true)}
          disabled={isLoading}
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          {t(language, 'phoneVerification.confirmViaBot')}
        </Button>

        {showManual && (
          <Card className="mt-2">
            <CardContent className="p-4 flex flex-col gap-3">
              <p className="text-sm text-[var(--tg-hint-color)]">
                {t(language, 'phoneVerification.manualInput')}
              </p>
              <Input
                type="tel"
                placeholder={t(language, 'phoneVerification.phonePlaceholder')}
                value={manualPhone}
                onChange={(e) => setManualPhone(e.target.value)}
                className="min-h-11"
              />
              <Button
                onClick={handleManualConfirm}
                disabled={isLoading || !manualPhone.trim()}
                className="min-h-11"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                {t(language, 'common.confirm')}
              </Button>
            </CardContent>
          </Card>
        )}

        {error && (
          <p className="text-sm text-[var(--tg-destructive-text-color)] text-center">{error}</p>
        )}
      </div>

      <Button
        variant="ghost"
        className="w-full min-h-11 text-[var(--tg-hint-color)] mt-4"
        onClick={handleSkip}
      >
        {t(language, 'phoneVerification.skip')}
      </Button>
    </div>
  );
}
