'use client';

import { useState, useEffect } from 'react';
import { Heart, MapPin, Clock, Calendar, Users } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t, CATEGORY_KEYS, DISTRICT_KEYS } from '@/lib/i18n';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface Job {
  id: string;
  title: string;
  category: string;
  district: string;
  date: string;
  startTime: string;
  payment: number;
  paymentType: string;
  workersNeeded: number;
  workersApplied: number;
  companyName: string;
  experienceRequired: boolean;
}

const CATEGORY_ICONS: Record<string, string> = {
  courier: '🚴',
  loader: '📦',
  promouter: '📣',
  waiter: '🍽️',
  cleaning: '🧹',
  other: '🔧',
};

export function WorkerFavoritesScreen() {
  const { language, favorites, setSelectedJobId, navigateTo, toggleFavorite } = useAppStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await api.jobs.list();
        const data = (response as Record<string, unknown>)?.data;
        const allJobs = Array.isArray(data) ? data : [];
        setJobs(allJobs.filter((j: Job) => favorites.includes(j.id)));
      } catch {
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (favorites.length > 0) {
      load();
    } else {
      setJobs([]);
      setIsLoading(false);
    }
  }, [favorites]);

  const getCategoryName = (cat: string) => {
    const key = CATEGORY_KEYS.find(k => k === cat);
    return key ? t(language, `categories.${key}`) : cat;
  };

  const getDistrictName = (dist: string) => {
    const key = DISTRICT_KEYS.find(k => k === dist);
    return key ? t(language, `districts.${key}`) : dist;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--tg-bg-color)]">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-[var(--tg-text-color)]">
          {t(language, 'favorites.title')}
        </h1>
      </div>

      <div className="flex-1 px-4 pb-4">
        {isLoading ? (
          <p className="text-[var(--tg-hint-color)] text-center py-8">{t(language, 'common.loading')}</p>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-[var(--tg-secondary-bg-color)] flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-[var(--tg-hint-color)]" />
            </div>
            <p className="text-[var(--tg-hint-color)] text-center">{t(language, 'favorites.noFavorites')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {jobs.map((job) => {
              const spotsLeft = job.workersNeeded - job.workersApplied;
              return (
                <Card
                  key={job.id}
                  className="cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
                  onClick={() => {
                    setSelectedJobId(job.id);
                    navigateTo('workerJobDetail');
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[var(--tg-secondary-bg-color)] flex items-center justify-center text-2xl shrink-0">
                        {CATEGORY_ICONS[job.category] || '🔧'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-[var(--tg-text-color)] text-base leading-tight">{job.title}</h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(job.id);
                            }}
                            className="shrink-0 p-1"
                          >
                            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                          </button>
                        </div>
                        <p className="text-sm text-[var(--tg-hint-color)] mt-0.5">{job.companyName}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="secondary" className="text-xs gap-1">
                        <MapPin className="w-3 h-3" />
                        {getDistrictName(job.district)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(job.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                      </Badge>
                      <Badge variant="secondary" className="text-xs gap-1">
                        <Clock className="w-3 h-3" />
                        {job.startTime?.slice(0, 5)}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--tg-secondary-bg-color)]">
                      <span className="text-xl font-bold text-[var(--tg-button-color)]">
                        {job.payment?.toLocaleString()} ₸
                      </span>
                      {spotsLeft > 0 && (
                        <div className="flex items-center gap-1 text-xs text-amber-600">
                          <Users className="w-3.5 h-3.5" />
                          {spotsLeft} {t(language, 'jobCard.spotsLeft')}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
