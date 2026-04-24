'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Bell, CheckCircle, AlertCircle, UserCheck, UserX, Banknote, Star } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';

interface NotificationItem {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const NOTIFICATION_ICONS: Record<string, React.ReactNode> = {
  login: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  confirm_phone: <AlertCircle className="w-5 h-5 text-amber-500" />,
  applied: <Bell className="w-5 h-5 text-blue-500" />,
  approved: <UserCheck className="w-5 h-5 text-green-500" />,
  shift_tomorrow: <AlertCircle className="w-5 h-5 text-blue-500" />,
  worker_confirmed: <UserCheck className="w-5 h-5 text-green-500" />,
  worker_no_show: <UserX className="w-5 h-5 text-red-500" />,
  payment_marked: <Banknote className="w-5 h-5 text-emerald-500" />,
  leave_review: <Star className="w-5 h-5 text-amber-500" />,
};

export function NotificationsScreen() {
  const { language, goBack } = useAppStore();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await api.notifications.list();
        const data = (response as Record<string, unknown>)?.data;
        setNotifications(Array.isArray(data) ? data : []);
      } catch {
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--tg-bg-color)]">
      <div className="sticky top-0 z-10 bg-[var(--tg-bg-color)] px-4 py-3 flex items-center gap-3 border-b border-[var(--tg-secondary-bg-color)]">
        <button onClick={goBack} className="p-1">
          <ArrowLeft className="w-6 h-6 text-[var(--tg-text-color)]" />
        </button>
        <h1 className="text-lg font-semibold text-[var(--tg-text-color)]">
          {t(language, 'notifications.title')}
        </h1>
      </div>

      <div className="flex-1 px-4 py-4">
        {isLoading ? (
          <p className="text-[var(--tg-hint-color)] text-center py-8">{t(language, 'common.loading')}</p>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-[var(--tg-secondary-bg-color)] flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-[var(--tg-hint-color)]" />
            </div>
            <p className="text-[var(--tg-hint-color)]">{t(language, 'notifications.noNotifications')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {notifications.map((notif) => (
              <Card
                key={notif.id}
                className={`${!notif.read ? 'bg-[var(--tg-button-color)]/5 border-[var(--tg-button-color)]/20' : ''}`}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    {NOTIFICATION_ICONS[notif.type] || <Bell className="w-5 h-5 text-[var(--tg-hint-color)]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--tg-text-color)] leading-snug">{notif.message}</p>
                    <p className="text-xs text-[var(--tg-hint-color)] mt-1">
                      {new Date(notif.createdAt).toLocaleString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-[var(--tg-button-color)] shrink-0 mt-2" />
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
