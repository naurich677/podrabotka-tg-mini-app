'use client';

import { useState, useEffect } from 'react';
import { History, TrendingUp } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HistoryItem {
  id: string;
  jobTitle: string;
  companyName: string;
  date: string;
  payment: number;
  status: string;
}

export function WorkerHistoryScreen() {
  const { language } = useAppStore();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await api.applications.my();
        const data = (response as Record<string, unknown>)?.data;
        const allApps = Array.isArray(data) ? data : [];
        const completed = allApps.filter(
          (a: Record<string, unknown>) => a.status === 'paid' || a.status === 'completed'
        );
        setHistory(completed.map((a: Record<string, unknown>) => ({
          id: a.id as string,
          jobTitle: ((a as Record<string, Record<string, unknown>>).job?.title || '') as string,
          companyName: ((a as Record<string, Record<string, unknown>>).job?.companyName || '') as string,
          date: ((a as Record<string, Record<string, unknown>>).job?.date || '') as string,
          payment: ((a as Record<string, Record<string, unknown>>).job?.payment || 0) as number,
          status: a.status as string,
        })));
      } catch {
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const totalEarned = history.reduce((sum, h) => sum + (h.status === 'paid' ? h.payment : 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--tg-bg-color)]">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-[var(--tg-text-color)]">
          {t(language, 'history.title')}
        </h1>
      </div>

      {/* Stats */}
      {history.length > 0 && (
        <div className="px-4 py-2">
          <Card className="bg-[var(--tg-button-color)]/5 border-[var(--tg-button-color)]/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--tg-button-color)]/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[var(--tg-button-color)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--tg-hint-color)]">{t(language, 'history.totalEarned')}</p>
                <p className="text-2xl font-bold text-[var(--tg-button-color)]">{totalEarned.toLocaleString()} ₸</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm text-[var(--tg-hint-color)]">{t(language, 'history.completedShifts')}</p>
                <p className="text-2xl font-bold text-[var(--tg-text-color)]">{history.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex-1 px-4 pb-4">
        {isLoading ? (
          <p className="text-[var(--tg-hint-color)] text-center py-8">{t(language, 'common.loading')}</p>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-[var(--tg-secondary-bg-color)] flex items-center justify-center mb-4">
              <History className="w-8 h-8 text-[var(--tg-hint-color)]" />
            </div>
            <p className="text-[var(--tg-hint-color)] text-center">{t(language, 'history.noHistory')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-[var(--tg-text-color)] text-base">{item.jobTitle}</h3>
                    <Badge className={`${item.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'} text-xs border-0 shrink-0`}>
                      {item.status === 'paid' ? t(language, 'myApplications.paid') : t(language, 'myApplications.completed')}
                    </Badge>
                  </div>
                  <p className="text-sm text-[var(--tg-hint-color)]">{item.companyName}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-[var(--tg-hint-color)]">
                      {new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="font-semibold text-[var(--tg-text-color)]">{item.payment?.toLocaleString()} ₸</span>
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
