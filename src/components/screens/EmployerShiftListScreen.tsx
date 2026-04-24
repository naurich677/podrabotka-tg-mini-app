'use client';

import { useState, useEffect } from 'react';
import { ClipboardList, Users } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface ShiftItem {
  id: string;
  title: string;
  date: string;
  workersNeeded: number;
  workersApplied: number;
  status: string;
  payment: number;
  category: string;
}

export function EmployerShiftListScreen() {
  const { language, navigateTo, setSelectedShiftId } = useAppStore();
  const [shifts, setShifts] = useState<ShiftItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await api.jobs.list();
        const data = (response as Record<string, unknown>)?.data;
        setShifts(Array.isArray(data) ? data : []);
      } catch {
        setShifts([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredShifts = shifts.filter((s) => {
    if (activeTab === 'drafts') return s.status === 'draft';
    if (activeTab === 'active') return s.status === 'active' || s.status === 'in_progress' || s.status === 'full';
    if (activeTab === 'completed') return s.status === 'completed';
    if (activeTab === 'cancelled') return s.status === 'cancelled';
    return true;
  });

  const handleShiftClick = (shiftId: string) => {
    setSelectedShiftId(shiftId);
    navigateTo('employerApplications');
  };

  const renderShiftList = (items: ShiftItem[]) => {
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-[var(--tg-secondary-bg-color)] flex items-center justify-center mb-4">
            <ClipboardList className="w-8 h-8 text-[var(--tg-hint-color)]" />
          </div>
          <p className="text-[var(--tg-hint-color)]">{t(language, 'shiftList.noShifts')}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        {items.map((shift) => (
          <Card
            key={shift.id}
            className="cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
            onClick={() => handleShiftClick(shift.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-[var(--tg-text-color)] text-base">{shift.title}</h3>
                <span className="text-lg font-bold text-[var(--tg-button-color)] shrink-0">
                  {shift.payment?.toLocaleString()} ₸
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--tg-hint-color)]">
                <span>{new Date(shift.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {shift.workersApplied}/{shift.workersNeeded}
                </span>
                <Badge variant="secondary" className="text-xs ml-auto">{shift.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--tg-bg-color)]">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-[var(--tg-text-color)]">
          {t(language, 'shiftList.title')}
        </h1>
      </div>

      <div className="flex-1 px-4 pb-4">
        {isLoading ? (
          <div className="flex flex-col gap-3 mt-2">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="drafts" className="text-xs">{t(language, 'shiftList.drafts')}</TabsTrigger>
              <TabsTrigger value="active" className="text-xs">{t(language, 'shiftList.active')}</TabsTrigger>
              <TabsTrigger value="completed" className="text-xs">{t(language, 'shiftList.completed')}</TabsTrigger>
              <TabsTrigger value="cancelled" className="text-xs">{t(language, 'shiftList.cancelled')}</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-3">
              {renderShiftList(filteredShifts)}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
