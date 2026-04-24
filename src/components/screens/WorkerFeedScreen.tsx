'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, MapPin, Clock, Users, Zap, Calendar, Star } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t, CATEGORY_KEYS, DISTRICT_KEYS } from '@/lib/i18n';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Job {
  id: string;
  title: string;
  category: string;
  city: string;
  district: string;
  address: string;
  date: string;
  startTime: string;
  endTime: string;
  payment: number;
  paymentType: string;
  paymentSchedule: string;
  workersNeeded: number;
  workersApplied: number;
  experienceRequired: boolean;
  documentsRequired: boolean;
  description: string;
  requirements: string;
  companyName: string;
  status: string;
  createdAt: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  courier: '🚴',
  loader: '📦',
  promouter: '📣',
  waiter: '🍽️',
  cleaning: '🧹',
  other: '🔧',
};

export function WorkerFeedScreen() {
  const { language, navigateTo, setSelectedJobId, filters, setFilters, toggleFavorite, favorites } = useAppStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePill, setActivePill] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filters.category) params.category = filters.category;
      if (filters.district) params.district = filters.district;
      if (filters.date) params.date = filters.date;
      if (filters.paymentType) params.paymentType = filters.paymentType;
      if (searchQuery) params.search = searchQuery;

      const response = await api.jobs.list(params);
      const data = (response as Record<string, unknown>)?.data;
      setJobs(Array.isArray(data) ? data : []);
    } catch {
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, searchQuery]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleJobClick = (jobId: string) => {
    setSelectedJobId(jobId);
    navigateTo('workerJobDetail');
  };

  const handlePillClick = (pill: string) => {
    if (activePill === pill) {
      setActivePill(null);
      setFilters({});
    } else {
      setActivePill(pill);
      const newFilters: Record<string, string | undefined> = {};
      if (pill === 'today') {
        newFilters.date = new Date().toISOString().split('T')[0];
      } else if (pill === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        newFilters.date = tomorrow.toISOString().split('T')[0];
      } else if (pill === 'dailyPay') {
        newFilters.paymentType = 'daily';
      }
      setFilters(newFilters);
    }
  };

  const pills = [
    { key: 'today', label: t(language, 'feed.today') },
    { key: 'tomorrow', label: t(language, 'feed.tomorrow') },
    { key: 'dailyPay', label: t(language, 'feed.dailyPay') },
    { key: 'nearby', label: t(language, 'feed.nearby') },
    { key: 'urgent', label: t(language, 'feed.urgent') },
  ];

  const getCategoryName = (cat: string) => {
    const key = CATEGORY_KEYS.find(k => k === cat);
    return key ? t(language, `categories.${key}`) : cat;
  };

  const getDistrictName = (dist: string) => {
    const key = DISTRICT_KEYS.find(k => k === dist);
    return key ? t(language, `districts.${key}`) : dist;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--tg-bg-color)]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--tg-bg-color)] px-4 pt-3 pb-2">
        <h1 className="text-xl font-bold text-[var(--tg-text-color)] mb-3">
          {t(language, 'feed.title')}
        </h1>
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--tg-hint-color)]" />
            <Input
              placeholder={t(language, 'feed.search')}
              className="pl-9 min-h-11 bg-[var(--tg-secondary-bg-color)] border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="min-h-11 min-w-11 shrink-0"
            onClick={() => navigateTo('workerFilters')}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {pills.map((pill) => (
            <button
              key={pill.key}
              onClick={() => handlePillClick(pill.key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activePill === pill.key
                  ? 'bg-[var(--tg-button-color)] text-[var(--tg-button-text-color)]'
                  : 'bg-[var(--tg-secondary-bg-color)] text-[var(--tg-text-color)]'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Job List */}
      <div className="flex-1 px-4 pb-4 pt-2">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <Skeleton className="h-8 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--tg-secondary-bg-color)] flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-[var(--tg-hint-color)]" />
            </div>
            <p className="text-[var(--tg-hint-color)] text-lg">{t(language, 'feed.noJobs')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {jobs.map((job) => {
              const spotsLeft = job.workersNeeded - job.workersApplied;
              const isSaved = favorites.includes(job.id);

              return (
                <Card
                  key={job.id}
                  className="cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
                  onClick={() => handleJobClick(job.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[var(--tg-secondary-bg-color)] flex items-center justify-center text-2xl shrink-0">
                        {CATEGORY_ICONS[job.category] || '🔧'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-[var(--tg-text-color)] text-base leading-tight">
                            {job.title}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(job.id);
                            }}
                            className="shrink-0 p-1"
                          >
                            <Star className={`w-5 h-5 ${isSaved ? 'fill-amber-400 text-amber-400' : 'text-[var(--tg-hint-color)]'}`} />
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
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-[var(--tg-button-color)]">
                          {job.payment?.toLocaleString()}
                        </span>
                        <span className="text-sm text-[var(--tg-hint-color)]">
                          ₸{job.paymentType === 'daily' ? t(language, 'common.perDay') : t(language, 'common.perWeek')}
                        </span>
                      </div>
                      {spotsLeft > 0 && (
                        <div className="flex items-center gap-1 text-xs text-amber-600">
                          <Users className="w-3.5 h-3.5" />
                          {spotsLeft} {t(language, 'jobCard.spotsLeft')}
                        </div>
                      )}
                      {job.experienceRequired && (
                        <Badge variant="outline" className="text-xs">{t(language, 'jobCard.experience')}</Badge>
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
