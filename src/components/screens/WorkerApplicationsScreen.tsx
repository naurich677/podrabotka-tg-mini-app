'use client';

import { useState, useEffect } from 'react';
import { ClipboardList } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Application {
  id: string;
  status: string;
  job: {
    id: string;
    title: string;
    companyName: string;
    date: string;
    payment: number;
    paymentType: string;
    category: string;
  };
}

const STATUS_COLORS: Record<string, string> = {
  applied: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  arrived: 'bg-teal-100 text-teal-700',
  completed: 'bg-purple-100 text-purple-700',
  paid: 'bg-emerald-100 text-emerald-700',
  no_show: 'bg-orange-100 text-orange-700',
};

export function WorkerApplicationsScreen() {
  const { language, setSelectedJobId, navigateTo } = useAppStore();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await api.applications.my();
        const data = (response as Record<string, unknown>)?.data;
        setApplications(Array.isArray(data) ? data : []);
      } catch {
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleApplicationClick = (jobId: string) => {
    setSelectedJobId(jobId);
    navigateTo('workerJobDetail');
  };

  const getStatusLabel = (status: string) => {
    const key = status === 'no_show' ? 'noShow' : status;
    return t(language, `myApplications.${key}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--tg-bg-color)]">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-[var(--tg-text-color)]">
          {t(language, 'myApplications.title')}
        </h1>
      </div>

      <div className="flex-1 px-4 pb-4">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-[var(--tg-secondary-bg-color)] flex items-center justify-center mb-4">
              <ClipboardList className="w-8 h-8 text-[var(--tg-hint-color)]" />
            </div>
            <p className="text-[var(--tg-hint-color)] text-center">{t(language, 'myApplications.noApplications')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {applications.map((app) => (
              <Card
                key={app.id}
                className="cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
                onClick={() => handleApplicationClick(app.job.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-[var(--tg-text-color)] text-base">{app.job.title}</h3>
                    <Badge className={`${STATUS_COLORS[app.status] || 'bg-gray-100 text-gray-700'} text-xs shrink-0 border-0`}>
                      {getStatusLabel(app.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-[var(--tg-hint-color)]">{app.job.companyName}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-[var(--tg-hint-color)]">
                      {new Date(app.job.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="font-semibold text-[var(--tg-text-color)]">
                      {app.job.payment?.toLocaleString()} ₸
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
