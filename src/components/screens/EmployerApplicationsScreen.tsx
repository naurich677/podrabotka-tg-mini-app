'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, UserCheck, UserX } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface Applicant {
  id: string;
  userId: string;
  firstName: string;
  lastName?: string;
  status: string;
  rating?: number;
  completedShifts?: number;
}

interface ShiftInfo {
  id: string;
  title: string;
  date: string;
  workersNeeded: number;
  workersApplied: number;
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

export function EmployerApplicationsScreen() {
  const { language, selectedShiftId, goBack } = useAppStore();
  const [shift, setShift] = useState<ShiftInfo | null>(null);
  const [applications, setApplications] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedShiftId) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await api.jobs.get(selectedShiftId);
        const data = (response as Record<string, unknown>)?.data as Record<string, unknown> | undefined;
        if (data) {
          setShift({
            id: data.id as string,
            title: data.title as string,
            date: data.date as string,
            workersNeeded: data.workersNeeded as number,
            workersApplied: data.workersApplied as number,
          });
          // For now, applications are simulated from the job data
          setApplications([]);
        }
      } catch {
        // handle error
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [selectedShiftId]);

  const handleAction = async (action: 'approve' | 'reject' | 'arrived' | 'complete' | 'paid', appId: string) => {
    setActionLoading(appId);
    try {
      await api.applications[action](appId);
      setApplications(prev => prev.map(a =>
        a.id === appId ? { ...a, status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : action === 'arrived' ? 'arrived' : action === 'complete' ? 'completed' : 'paid' } : a
      ));
    } catch {
      // handle error
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusLabel = (status: string) => {
    const key = status === 'no_show' ? 'noShow' : status;
    return t(language, `myApplications.${key}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--tg-bg-color)]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--tg-bg-color)] px-4 py-3 flex items-center gap-3 border-b border-[var(--tg-secondary-bg-color)]">
        <button onClick={goBack} className="p-1">
          <ArrowLeft className="w-6 h-6 text-[var(--tg-text-color)]" />
        </button>
        <h1 className="text-lg font-semibold text-[var(--tg-text-color)]">
          {t(language, 'applications.title')}
        </h1>
      </div>

      {/* Shift Info */}
      {shift && (
        <div className="px-4 py-3">
          <Card className="bg-[var(--tg-button-color)]/5 border-[var(--tg-button-color)]/20">
            <CardContent className="p-4">
              <h2 className="font-semibold text-[var(--tg-text-color)] text-lg mb-1">{shift.title}</h2>
              <div className="flex items-center gap-3 text-sm text-[var(--tg-hint-color)]">
                <span>{new Date(shift.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                <span>{shift.workersApplied}/{shift.workersNeeded} {t(language, 'applications.spotsFilled')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Separator />

      {/* Applications List */}
      <div className="flex-1 px-4 py-4">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-[var(--tg-secondary-bg-color)] flex items-center justify-center mb-4">
              <UserCheck className="w-8 h-8 text-[var(--tg-hint-color)]" />
            </div>
            <p className="text-[var(--tg-hint-color)]">{t(language, 'applications.noApplications')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {applications.map((app) => (
              <Card key={app.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-[var(--tg-text-color)]">
                        {app.firstName} {app.lastName || ''}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-[var(--tg-hint-color)] mt-1">
                        {app.rating !== undefined && (
                          <span>⭐ {app.rating}</span>
                        )}
                        {app.completedShifts !== undefined && (
                          <span>{app.completedShifts} {t(language, 'applications.completedShifts')}</span>
                        )}
                      </div>
                    </div>
                    <Badge className={`${STATUS_COLORS[app.status] || 'bg-gray-100 text-gray-700'} text-xs border-0`}>
                      {getStatusLabel(app.status)}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    {app.status === 'applied' && (
                      <>
                        <Button
                          size="sm"
                          className="flex-1 min-h-9 bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleAction('approve', app.id)}
                          disabled={actionLoading === app.id}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {t(language, 'applications.approve')}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1 min-h-9"
                          onClick={() => handleAction('reject', app.id)}
                          disabled={actionLoading === app.id}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          {t(language, 'applications.reject')}
                        </Button>
                      </>
                    )}
                    {app.status === 'approved' && (
                      <>
                        <Button
                          size="sm"
                          className="flex-1 min-h-9 bg-teal-600 hover:bg-teal-700"
                          onClick={() => handleAction('arrived', app.id)}
                          disabled={actionLoading === app.id}
                        >
                          <UserCheck className="w-4 h-4 mr-1" />
                          {t(language, 'attendance.markArrived')}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 min-h-9"
                          onClick={() => handleAction('reject', app.id)}
                          disabled={actionLoading === app.id}
                        >
                          <UserX className="w-4 h-4 mr-1" />
                          {t(language, 'attendance.markNotArrived')}
                        </Button>
                      </>
                    )}
                    {app.status === 'arrived' && (
                      <Button
                        size="sm"
                        className="w-full min-h-9 bg-purple-600 hover:bg-purple-700"
                        onClick={() => handleAction('complete', app.id)}
                        disabled={actionLoading === app.id}
                      >
                        {t(language, 'myApplications.completed')}
                      </Button>
                    )}
                    {app.status === 'completed' && (
                      <Button
                        size="sm"
                        className="w-full min-h-9 bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleAction('paid', app.id)}
                        disabled={actionLoading === app.id}
                      >
                        {t(language, 'paymentTracking.markPaid')}
                      </Button>
                    )}
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
