'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Users, CheckCircle, CalendarPlus, TrendingUp } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ShiftItem {
  id: string;
  title: string;
  date: string;
  workersNeeded: number;
  workersApplied: number;
  status: string;
  payment: number;
}

export function EmployerDashboardScreen() {
  const { language, navigateTo, setSelectedShiftId } = useAppStore();
  const [shifts, setShifts] = useState<ShiftItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    activeShifts: 0,
    totalApplications: 0,
    confirmedWorkers: 0,
  });

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await api.jobs.list();
        const data = (response as Record<string, unknown>)?.data;
        const allShifts = Array.isArray(data) ? data : [];
        setShifts(allShifts);

        const active = allShifts.filter((s: ShiftItem) => s.status === 'active' || s.status === 'in_progress');
        setStats({
          activeShifts: active.length,
          totalApplications: allShifts.reduce((sum: number, s: ShiftItem) => sum + (s.workersApplied || 0), 0),
          confirmedWorkers: 0,
        });
      } catch {
        setShifts([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const upcomingShifts = shifts
    .filter((s) => s.status === 'active' && new Date(s.date) >= new Date())
    .slice(0, 3);

  const handleShiftClick = (shiftId: string) => {
    setSelectedShiftId(shiftId);
    navigateTo('employerApplications');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--tg-bg-color)]">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-[var(--tg-text-color)]">
          {t(language, 'dashboard.title')}
        </h1>
      </div>

      {/* Stats */}
      <div className="px-4 py-2">
        {isLoading ? (
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-3 flex flex-col items-center">
                  <Skeleton className="w-8 h-8 rounded-lg mb-2" />
                  <Skeleton className="h-6 w-8 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <Card>
              <CardContent className="p-3 flex flex-col items-center text-center">
                <Briefcase className="w-6 h-6 text-[var(--tg-button-color)] mb-1" />
                <span className="text-2xl font-bold text-[var(--tg-text-color)]">{stats.activeShifts}</span>
                <span className="text-xs text-[var(--tg-hint-color)]">{t(language, 'dashboard.activeShifts')}</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 flex flex-col items-center text-center">
                <TrendingUp className="w-6 h-6 text-amber-500 mb-1" />
                <span className="text-2xl font-bold text-[var(--tg-text-color)]">{stats.totalApplications}</span>
                <span className="text-xs text-[var(--tg-hint-color)]">{t(language, 'dashboard.totalApplications')}</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 flex flex-col items-center text-center">
                <CheckCircle className="w-6 h-6 text-emerald-500 mb-1" />
                <span className="text-2xl font-bold text-[var(--tg-text-color)]">{stats.confirmedWorkers}</span>
                <span className="text-xs text-[var(--tg-hint-color)]">{t(language, 'dashboard.confirmedWorkers')}</span>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Create Button */}
      <div className="px-4 py-3">
        <Button
          className="w-full min-h-12 text-base font-semibold bg-[var(--tg-button-color)] hover:bg-[var(--tg-button-color)]/90 text-[var(--tg-button-text-color)]"
          onClick={() => navigateTo('employerCreateShift')}
        >
          <CalendarPlus className="w-5 h-5 mr-2" />
          {t(language, 'dashboard.createNew')}
        </Button>
      </div>

      {/* Upcoming Shifts */}
      <div className="px-4 pb-2">
        <h2 className="text-base font-semibold text-[var(--tg-text-color)] mb-2">
          {t(language, 'dashboard.upcomingShifts')}
        </h2>
      </div>

      <div className="flex-1 px-4 pb-4">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : upcomingShifts.length === 0 ? (
          <Card>
            <CardContent className="p-8 flex flex-col items-center text-center">
              <Users className="w-12 h-12 text-[var(--tg-hint-color)] mb-3" />
              <p className="text-[var(--tg-hint-color)]">{t(language, 'shiftList.noShifts')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {upcomingShifts.map((shift) => (
              <Card
                key={shift.id}
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => handleShiftClick(shift.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-[var(--tg-text-color)]">{shift.title}</h3>
                    <span className="text-lg font-bold text-[var(--tg-button-color)]">
                      {shift.payment?.toLocaleString()} ₸
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[var(--tg-hint-color)]">
                    <span>{new Date(shift.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {shift.workersApplied}/{shift.workersNeeded}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
