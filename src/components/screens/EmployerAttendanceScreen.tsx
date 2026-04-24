'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, UserCheck, UserX } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AttendanceWorker {
  id: string;
  firstName: string;
  lastName?: string;
  status: string;
  arrived: boolean;
}

export function EmployerAttendanceScreen() {
  const { language, selectedShiftId, goBack } = useAppStore();
  const [workers, setWorkers] = useState<AttendanceWorker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading attendance data
    setIsLoading(false);
    setWorkers([]);
  }, [selectedShiftId]);

  const handleToggleArrived = async (appId: string, arrived: boolean) => {
    setActionLoading(appId);
    try {
      if (arrived) {
        await api.applications.arrived(appId);
      } else {
        // Mark as no show - use reject as a proxy
        await api.applications.reject(appId);
      }
      setWorkers(prev => prev.map(w =>
        w.id === appId ? { ...w, arrived } : w
      ));
    } catch {
      // handle error
    } finally {
      setActionLoading(null);
    }
  };

  const arrivedCount = workers.filter(w => w.arrived).length;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--tg-bg-color)]">
      <div className="sticky top-0 z-10 bg-[var(--tg-bg-color)] px-4 py-3 flex items-center gap-3 border-b border-[var(--tg-secondary-bg-color)]">
        <button onClick={goBack} className="p-1">
          <ArrowLeft className="w-6 h-6 text-[var(--tg-text-color)]" />
        </button>
        <h1 className="text-lg font-semibold text-[var(--tg-text-color)]">
          {t(language, 'attendance.title')}
        </h1>
      </div>

      {/* Summary */}
      {workers.length > 0 && (
        <div className="px-4 py-3">
          <Card className="bg-[var(--tg-button-color)]/5 border-[var(--tg-button-color)]/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[var(--tg-button-color)]">
                {arrivedCount} {t(language, 'attendance.of')} {workers.length}
              </p>
              <p className="text-sm text-[var(--tg-hint-color)]">{t(language, 'attendance.arrived')}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex-1 px-4 pb-4">
        {isLoading ? (
          <p className="text-[var(--tg-hint-color)] text-center py-8">{t(language, 'common.loading')}</p>
        ) : workers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <UserCheck className="w-16 h-16 text-[var(--tg-hint-color)] mb-4" />
            <p className="text-[var(--tg-hint-color)]">{t(language, 'applications.noApplications')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {workers.map((worker) => (
              <Card key={worker.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-semibold text-[var(--tg-text-color)]">
                        {worker.firstName} {worker.lastName || ''}
                      </h3>
                    </div>
                    <Badge className={`${worker.arrived ? 'bg-teal-100 text-teal-700' : 'bg-orange-100 text-orange-700'} text-xs border-0`}>
                      {worker.arrived ? t(language, 'attendance.arrived') : t(language, 'attendance.notArrived')}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={worker.arrived ? 'outline' : 'default'}
                      className={`flex-1 min-h-9 ${!worker.arrived ? 'bg-teal-600 hover:bg-teal-700' : ''}`}
                      onClick={() => handleToggleArrived(worker.id, true)}
                      disabled={actionLoading === worker.id || worker.arrived}
                    >
                      <UserCheck className="w-4 h-4 mr-1" />
                      {t(language, 'attendance.markArrived')}
                    </Button>
                    <Button
                      size="sm"
                      variant={worker.arrived ? 'destructive' : 'outline'}
                      className="flex-1 min-h-9"
                      onClick={() => handleToggleArrived(worker.id, false)}
                      disabled={actionLoading === worker.id || !worker.arrived}
                    >
                      <UserX className="w-4 h-4 mr-1" />
                      {t(language, 'attendance.markNotArrived')}
                    </Button>
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
