'use client';

import { Briefcase, ClipboardList, Heart, User, Plus, CalendarDays } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import type { Screen } from '@/lib/store';

interface NavItem {
  key: string;
  screen: Screen;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  label: string;
}

export function BottomNav() {
  const { language, user, currentScreen, navigateTo } = useAppStore();

  const workerNav: NavItem[] = [
    {
      key: 'feed',
      screen: 'workerFeed',
      icon: <Briefcase className="w-5 h-5" />,
      activeIcon: <Briefcase className="w-5 h-5" />,
      label: t(language, 'nav.feed'),
    },
    {
      key: 'applications',
      screen: 'workerApplications',
      icon: <ClipboardList className="w-5 h-5" />,
      activeIcon: <ClipboardList className="w-5 h-5" />,
      label: t(language, 'nav.applications'),
    },
    {
      key: 'favorites',
      screen: 'workerFavorites',
      icon: <Heart className="w-5 h-5" />,
      activeIcon: <Heart className="w-5 h-5" />,
      label: t(language, 'nav.favorites'),
    },
    {
      key: 'profile',
      screen: 'profile',
      icon: <User className="w-5 h-5" />,
      activeIcon: <User className="w-5 h-5" />,
      label: t(language, 'nav.profile'),
    },
  ];

  const employerNav: NavItem[] = [
    {
      key: 'shifts',
      screen: 'employerShiftList',
      icon: <CalendarDays className="w-5 h-5" />,
      activeIcon: <CalendarDays className="w-5 h-5" />,
      label: t(language, 'nav.shifts'),
    },
    {
      key: 'applications',
      screen: 'employerApplications',
      icon: <ClipboardList className="w-5 h-5" />,
      activeIcon: <ClipboardList className="w-5 h-5" />,
      label: t(language, 'nav.applications'),
    },
    {
      key: 'create',
      screen: 'employerCreateShift',
      icon: <Plus className="w-5 h-5" />,
      activeIcon: <Plus className="w-5 h-5" />,
      label: t(language, 'nav.create'),
    },
    {
      key: 'profile',
      screen: 'profile',
      icon: <User className="w-5 h-5" />,
      activeIcon: <User className="w-5 h-5" />,
      label: t(language, 'nav.profile'),
    },
  ];

  const navItems = user?.role === 'employer' ? employerNav : workerNav;

  const isActive = (screen: Screen) => {
    if (screen === 'workerFeed' && (currentScreen === 'workerFeed' || currentScreen === 'workerFilters' || currentScreen === 'workerJobDetail')) return true;
    if (screen === 'workerApplications' && currentScreen === 'workerApplications') return true;
    if (screen === 'workerFavorites' && currentScreen === 'workerFavorites') return true;
    if (screen === 'employerShiftList' && (currentScreen === 'employerShiftList' || currentScreen === 'employerApplications' || currentScreen === 'employerAttendance' || currentScreen === 'employerPaymentTracking')) return true;
    if (screen === 'employerCreateShift' && currentScreen === 'employerCreateShift') return true;
    if (screen === 'profile' && (currentScreen === 'profile' || currentScreen === 'profileEdit' || currentScreen === 'notifications' || currentScreen === 'workerHistory' || currentScreen === 'phoneVerification')) return true;
    return currentScreen === screen;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--tg-bg-color)] border-t border-[var(--tg-secondary-bg-color)] safe-bottom z-20">
      <div className="max-w-md mx-auto flex items-center justify-around h-14">
        {navItems.map((item) => {
          const active = isActive(item.screen);
          return (
            <button
              key={item.key}
              onClick={() => navigateTo(item.screen)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                active
                  ? 'text-[var(--tg-button-color)]'
                  : 'text-[var(--tg-hint-color)] hover:text-[var(--tg-text-color)]'
              }`}
            >
              {item.screen === 'employerCreateShift' ? (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center -mt-4 ${
                  active
                    ? 'bg-[var(--tg-button-color)] text-[var(--tg-button-text-color)]'
                    : 'bg-[var(--tg-secondary-bg-color)] text-[var(--tg-text-color)]'
                }`}>
                  {item.icon}
                </div>
              ) : (
                item.icon
              )}
              <span className={`text-[10px] leading-tight ${
                item.screen === 'employerCreateShift' ? 'mt-0.5' : ''
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
