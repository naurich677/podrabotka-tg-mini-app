'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { useTelegram } from '@/hooks/use-telegram';
import { setInitData } from '@/lib/api';
import { BottomNav } from '@/components/layout/BottomNav';

import { SplashScreen } from '@/components/screens/SplashScreen';
import { SelectLanguageScreen } from '@/components/screens/SelectLanguageScreen';
import { SelectRoleScreen } from '@/components/screens/SelectRoleScreen';
import { PhoneVerificationScreen } from '@/components/screens/PhoneVerificationScreen';
import { WorkerFeedScreen } from '@/components/screens/WorkerFeedScreen';
import { WorkerFiltersScreen } from '@/components/screens/WorkerFiltersScreen';
import { WorkerJobDetailScreen } from '@/components/screens/WorkerJobDetailScreen';
import { WorkerApplicationsScreen } from '@/components/screens/WorkerApplicationsScreen';
import { WorkerFavoritesScreen } from '@/components/screens/WorkerFavoritesScreen';
import { WorkerHistoryScreen } from '@/components/screens/WorkerHistoryScreen';
import { EmployerDashboardScreen } from '@/components/screens/EmployerDashboardScreen';
import { EmployerCreateShiftScreen } from '@/components/screens/EmployerCreateShiftScreen';
import { EmployerShiftListScreen } from '@/components/screens/EmployerShiftListScreen';
import { EmployerApplicationsScreen } from '@/components/screens/EmployerApplicationsScreen';
import { EmployerAttendanceScreen } from '@/components/screens/EmployerAttendanceScreen';
import { EmployerPaymentTrackingScreen } from '@/components/screens/EmployerPaymentTrackingScreen';
import { ProfileScreen } from '@/components/screens/ProfileScreen';
import { ProfileEditScreen } from '@/components/screens/ProfileEditScreen';
import { NotificationsScreen } from '@/components/screens/NotificationsScreen';

const ONBOARDING_SCREENS = ['splash', 'selectLanguage', 'selectRole', 'phoneVerification'];
const DETAIL_SCREENS = ['workerJobDetail', 'workerFilters', 'employerCreateShift', 'profileEdit', 'notifications', 'employerAttendance', 'employerPaymentTracking'];

function ScreenRenderer() {
  const { currentScreen } = useAppStore();

  switch (currentScreen) {
    case 'splash':
      return <SplashScreen />;
    case 'selectLanguage':
      return <SelectLanguageScreen />;
    case 'selectRole':
      return <SelectRoleScreen />;
    case 'phoneVerification':
      return <PhoneVerificationScreen />;
    case 'workerFeed':
      return <WorkerFeedScreen />;
    case 'workerFilters':
      return <WorkerFiltersScreen />;
    case 'workerJobDetail':
      return <WorkerJobDetailScreen />;
    case 'workerApplications':
      return <WorkerApplicationsScreen />;
    case 'workerFavorites':
      return <WorkerFavoritesScreen />;
    case 'workerHistory':
      return <WorkerHistoryScreen />;
    case 'employerDashboard':
      return <EmployerDashboardScreen />;
    case 'employerCreateShift':
      return <EmployerCreateShiftScreen />;
    case 'employerShiftList':
      return <EmployerShiftListScreen />;
    case 'employerApplications':
      return <EmployerApplicationsScreen />;
    case 'employerAttendance':
      return <EmployerAttendanceScreen />;
    case 'employerPaymentTracking':
      return <EmployerPaymentTrackingScreen />;
    case 'profile':
      return <ProfileScreen />;
    case 'profileEdit':
      return <ProfileEditScreen />;
    case 'notifications':
      return <NotificationsScreen />;
    default:
      return <SplashScreen />;
  }
}

export function AppShell() {
  const { currentScreen, isOnboarded } = useAppStore();
  const { isDark, initData, isReady } = useTelegram();

  // Set init data for API calls
  useEffect(() => {
    if (initData) {
      setInitData(initData);
    }
  }, [initData]);

  // Manage Telegram BackButton
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    const isMainScreen = !DETAIL_SCREENS.includes(currentScreen) && isOnboarded && currentScreen !== 'splash';

    if (DETAIL_SCREENS.includes(currentScreen)) {
      tg.BackButton.show();
    } else if (ONBOARDING_SCREENS.includes(currentScreen)) {
      tg.BackButton.hide();
    } else {
      tg.BackButton.hide();
    }

    if (isMainScreen) {
      tg.BackButton.hide();
    }
  }, [currentScreen, isOnboarded]);

  // Handle Telegram BackButton clicks
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    const handleBack = () => {
      const { goBack, currentScreen: screen } = useAppStore.getState();
      if (DETAIL_SCREENS.includes(screen)) {
        goBack();
      }
    };

    tg.BackButton.onClick(handleBack);
    return () => {
      tg.BackButton.offClick(handleBack);
    };
  }, []);

  const showBottomNav = isOnboarded && !ONBOARDING_SCREENS.includes(currentScreen) && !DETAIL_SCREENS.includes(currentScreen);

  return (
    <div className={`${isDark ? 'tg-dark' : ''} max-w-md mx-auto min-h-screen relative`}>
      <div className={`${showBottomNav ? 'pb-14' : ''} screen-enter`}>
        <ScreenRenderer />
      </div>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
