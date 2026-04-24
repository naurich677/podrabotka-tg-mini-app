'use client';

import { HardHat, Building2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';

export function SelectRoleScreen() {
  const { language, user, setUser, navigateTo, setOnboarded } = useAppStore();

  const handleSelectRole = async (role: 'worker' | 'employer') => {
    if (user) {
      setUser({ ...user, role });
    }

    // Navigate to phone verification or directly to feed
    if (user && !user.phoneVerified) {
      navigateTo('phoneVerification');
    } else {
      setOnboarded(true);
      navigateTo(role === 'worker' ? 'workerFeed' : 'employerDashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--tg-bg-color)] px-6 py-12">
      <div className="flex flex-col items-center gap-2 mb-8">
        <h1 className="text-2xl font-bold text-[var(--tg-text-color)] text-center">
          {t(language, 'selectRole.title')}
        </h1>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">
        <Card
          className="cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] border-2 border-transparent hover:border-[var(--tg-button-color)]"
          onClick={() => handleSelectRole('worker')}
        >
          <CardContent className="p-6 flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 rounded-2xl bg-amber-100 flex items-center justify-center">
              <HardHat className="w-10 h-10 text-amber-600" />
            </div>
            <span className="text-xl font-semibold text-[var(--tg-text-color)]">
              {t(language, 'selectRole.worker')}
            </span>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] border-2 border-transparent hover:border-[var(--tg-button-color)]"
          onClick={() => handleSelectRole('employer')}
        >
          <CardContent className="p-6 flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <Building2 className="w-10 h-10 text-emerald-600" />
            </div>
            <span className="text-xl font-semibold text-[var(--tg-text-color)]">
              {t(language, 'selectRole.employer')}
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
