'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Banknote } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PaymentWorker {
  id: string;
  firstName: string;
  lastName?: string;
  payment: number;
  paid: boolean;
}

export function EmployerPaymentTrackingScreen() {
  const { language, selectedShiftId, goBack } = useAppStore();
  const [workers, setWorkers] = useState<PaymentWorker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(false);
    setWorkers([]);
  }, [selectedShiftId]);

  const handleMarkPaid = async (appId: string) => {
    setActionLoading(appId);
    try {
      await api.applications.paid(appId);
      setWorkers(prev => prev.map(w =>
        w.id === appId ? { ...w, paid: true } : w
      ));
    } catch {
      // handle error
    } finally {
      setActionLoading(null);
    }
  };

  const paidCount = workers.filter(w => w.paid).length;
  const totalPaid = workers.filter(w => w.paid).reduce((sum, w) => sum + w.payment, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--tg-bg-color)]">
      <div className="sticky top-0 z-10 bg-[var(--tg-bg-color)] px-4 py-3 flex items-center gap-3 border-b border-[var(--tg-secondary-bg-color)]">
        <button onClick={goBack} className="p-1">
          <ArrowLeft className="w-6 h-6 text-[var(--tg-text-color)]" />
        </button>
        <h1 className="text-lg font-semibold text-[var(--tg-text-color)]">
          {t(language, 'paymentTracking.title')}
        </h1>
      </div>

      {/* Summary */}
      {workers.length > 0 && (
        <div className="px-4 py-3">
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--tg-hint-color)]">{t(language, 'paymentTracking.totalPaid')}</p>
                <p className="text-2xl font-bold text-emerald-600">{totalPaid.toLocaleString()} ₸</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[var(--tg-hint-color)]">{paidCount}/{workers.length}</p>
                <p className="text-sm text-emerald-600">{t(language, 'paymentTracking.paid')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex-1 px-4 pb-4">
        {isLoading ? (
          <p className="text-[var(--tg-hint-color)] text-center py-8">{t(language, 'common.loading')}</p>
        ) : workers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Banknote className="w-16 h-16 text-[var(--tg-hint-color)] mb-4" />
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
                      <p className="text-lg font-bold text-[var(--tg-text-color)] mt-1">
                        {worker.payment.toLocaleString()} ₸
                      </p>
                    </div>
                    <Badge className={`${worker.paid ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'} text-xs border-0`}>
                      {worker.paid ? t(language, 'paymentTracking.paid') : t(language, 'paymentTracking.notPaid')}
                    </Badge>
                  </div>
                  {!worker.paid && (
                    <Button
                      size="sm"
                      className="w-full min-h-9 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleMarkPaid(worker.id)}
                      disabled={actionLoading === worker.id}
                    >
                      <Banknote className="w-4 h-4 mr-1" />
                      {t(language, 'paymentTracking.markPaid')}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
