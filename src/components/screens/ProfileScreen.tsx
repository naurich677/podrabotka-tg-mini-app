'use client';

import { useState, useEffect } from 'react';
import {
  User, Phone, Star, Shield, Globe, MapPin, LogOut,
  ChevronRight, Edit3, Briefcase, Building2, Clock,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function ProfileScreen() {
  const { language, user, navigateTo, setUser, setLanguage } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.profile.get();
        const data = (response as Record<string, unknown>)?.data as Record<string, unknown> | undefined;
        if (data && user) {
          setUser({
            ...user,
            firstName: (data.firstName as string) || user.firstName,
            lastName: (data.lastName as string) || user.lastName,
            phone: (data.phone as string) || user.phone,
            phoneVerified: (data.phoneVerified as boolean) || user.phoneVerified,
          });
        }
      } catch {
        // keep current user data
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [user, setUser]);

  const handleSwitchRole = async () => {
    if (!user) return;
    const newRole = user.role === 'worker' ? 'employer' : 'worker';
    try {
      await api.profile.update({ role: newRole });
      setUser({ ...user, role: newRole });
      navigateTo(newRole === 'worker' ? 'workerFeed' : 'employerDashboard');
    } catch {
      // handle error
    }
  };

  const handleLanguageToggle = () => {
    const newLang = language === 'ru' ? 'kz' : 'ru';
    setLanguage(newLang);
  };

  const handleLogout = () => {
    setUser(null);
    navigateTo('splash');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--tg-bg-color)]">
        <p className="text-[var(--tg-hint-color)]">{t(language, 'common.error')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--tg-bg-color)]">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-[var(--tg-text-color)]">
          {t(language, 'profile.title')}
        </h1>
      </div>

      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        {/* Avatar & Name */}
        <Card className="mb-4">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[var(--tg-secondary-bg-color)] flex items-center justify-center shrink-0">
              {user.photoUrl ? (
                <img src={user.photoUrl} alt="" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-[var(--tg-hint-color)]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-[var(--tg-text-color)] truncate">
                {user.firstName || 'User'} {user.lastName || ''}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {user.role === 'worker'
                    ? t(language, 'profile.worker')
                    : t(language, 'profile.employer')
                  }
                </Badge>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => navigateTo('profileEdit')}
            >
              <Edit3 className="w-5 h-5 text-[var(--tg-hint-color)]" />
            </Button>
          </CardContent>
        </Card>

        {/* Phone Verification */}
        <Card className="mb-4">
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.phoneVerified ? 'bg-emerald-100' : 'bg-amber-100'}`}>
              <Phone className={`w-5 h-5 ${user.phoneVerified ? 'text-emerald-600' : 'text-amber-600'}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--tg-text-color)]">
                {user.phone || t(language, 'profile.phone')}
              </p>
              <p className="text-xs text-[var(--tg-hint-color)]">
                {user.phoneVerified
                  ? t(language, 'profile.phoneVerified')
                  : t(language, 'profile.phoneNotVerified')
                }
              </p>
            </div>
            {!user.phoneVerified && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigateTo('phoneVerification')}
              >
                {t(language, 'profile.verifyPhone')}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Worker-specific info */}
        {user.role === 'worker' && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-[var(--tg-hint-color)] mb-3 uppercase tracking-wider">
                {t(language, 'profile.worker')}
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--tg-text-color)]">{t(language, 'profile.rating')}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-[var(--tg-text-color)]">4.8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--tg-text-color)]">{t(language, 'profile.completedJobs')}</span>
                  <span className="text-sm font-medium text-[var(--tg-text-color)]">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--tg-text-color)]">{t(language, 'profile.city')}</span>
                  <span className="text-sm text-[var(--tg-text-color)]">{user.city}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Employer-specific info */}
        {user.role === 'employer' && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-[var(--tg-hint-color)] mb-3 uppercase tracking-wider">
                {t(language, 'profile.employer')}
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--tg-text-color)]">{t(language, 'profile.rating')}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-[var(--tg-text-color)]">4.5</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--tg-text-color)]">{t(language, 'profile.city')}</span>
                  <span className="text-sm text-[var(--tg-text-color)]">{user.city}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--tg-text-color)]">{t(language, 'profile.verified')}</span>
                  <Badge variant="secondary" className="text-xs">
                    {user.phoneVerified ? '✓' : '✗'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Separator className="my-2" />

        {/* Settings */}
        <div className="mt-4 flex flex-col gap-1">
          <button
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--tg-secondary-bg-color)] w-full text-left"
            onClick={handleLanguageToggle}
          >
            <Globe className="w-5 h-5 text-[var(--tg-hint-color)]" />
            <span className="flex-1 text-[var(--tg-text-color)]">{t(language, 'profile.language')}</span>
            <span className="text-sm text-[var(--tg-hint-color)]">{language === 'ru' ? 'Русский' : 'Қазақша'}</span>
            <ChevronRight className="w-4 h-4 text-[var(--tg-hint-color)]" />
          </button>

          <button
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--tg-secondary-bg-color)] w-full text-left"
            onClick={handleSwitchRole}
          >
            {user.role === 'worker' ? (
              <Building2 className="w-5 h-5 text-[var(--tg-hint-color)]" />
            ) : (
              <Briefcase className="w-5 h-5 text-[var(--tg-hint-color)]" />
            )}
            <span className="flex-1 text-[var(--tg-text-color)]">{t(language, 'profile.switchRole')}</span>
            <ChevronRight className="w-4 h-4 text-[var(--tg-hint-color)]" />
          </button>

          {user.role === 'worker' && (
            <button
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--tg-secondary-bg-color)] w-full text-left"
              onClick={() => navigateTo('workerHistory')}
            >
              <Clock className="w-5 h-5 text-[var(--tg-hint-color)]" />
              <span className="flex-1 text-[var(--tg-text-color)]">{t(language, 'history.title')}</span>
              <ChevronRight className="w-4 h-4 text-[var(--tg-hint-color)]" />
            </button>
          )}

          <button
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--tg-secondary-bg-color)] w-full text-left"
            onClick={() => navigateTo('notifications')}
          >
            <MapPin className="w-5 h-5 text-[var(--tg-hint-color)]" />
            <span className="flex-1 text-[var(--tg-text-color)]">{t(language, 'profile.city')}</span>
            <span className="text-sm text-[var(--tg-hint-color)]">{user.city}</span>
            <ChevronRight className="w-4 h-4 text-[var(--tg-hint-color)]" />
          </button>
        </div>

        <Separator className="my-4" />

        <Button
          variant="ghost"
          className="w-full text-[var(--tg-destructive-text-color)] hover:bg-red-50 min-h-11"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          {t(language, 'profile.logout')}
        </Button>
      </div>
    </div>
  );
}
