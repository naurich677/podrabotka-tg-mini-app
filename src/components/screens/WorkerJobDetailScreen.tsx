'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Calendar, Building2, Star, Share2, FileText, Award, Users, Zap } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t, CATEGORY_KEYS, DISTRICT_KEYS } from '@/lib/i18n';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface JobDetail {
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
  companyRating?: number;
  status: string;
}

export function WorkerJobDetailScreen() {
  const { language, selectedJobId, goBack, user, toggleFavorite, favorites } = useAppStore();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedJobId) return;
    const loadJob = async () => {
      setIsLoading(true);
      try {
        const response = await api.jobs.get(selectedJobId);
        const data = (response as Record<string, unknown>)?.data as JobDetail | undefined;
        setJob(data || null);
      } catch {
        setError(t(language, 'common.error'));
      } finally {
        setIsLoading(false);
      }
    };
    loadJob();
  }, [selectedJobId, language]);

  const handleApply = async () => {
    if (!selectedJobId || !user?.phoneVerified) return;
    setIsApplying(true);
    setError('');
    try {
      await api.jobs.apply(selectedJobId);
      setHasApplied(true);
    } catch {
      setError(t(language, 'common.error'));
    } finally {
      setIsApplying(false);
    }
  };

  const getCategoryName = (cat: string) => {
    const key = CATEGORY_KEYS.find(k => k === cat);
    return key ? t(language, `categories.${key}`) : cat;
  };

  const getDistrictName = (dist: string) => {
    const key = DISTRICT_KEYS.find(k => k === dist);
    return key ? t(language, `districts.${key}`) : dist;
  };

  const isSaved = job ? favorites.includes(job.id) : false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--tg-bg-color)] px-4 py-4">
        <Skeleton className="h-8 w-8 mb-4" />
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-20 w-full mb-4" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--tg-bg-color)] px-4">
        <p className="text-[var(--tg-hint-color)]">{error || t(language, 'common.error')}</p>
      </div>
    );
  }

  const spotsLeft = job.workersNeeded - job.workersApplied;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--tg-bg-color)]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--tg-bg-color)] px-4 py-3 flex items-center justify-between border-b border-[var(--tg-secondary-bg-color)]">
        <button onClick={goBack} className="p-1">
          <ArrowLeft className="w-6 h-6 text-[var(--tg-text-color)]" />
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => toggleFavorite(job.id)} className="p-1">
            <Star className={`w-6 h-6 ${isSaved ? 'fill-amber-400 text-amber-400' : 'text-[var(--tg-hint-color)]'}`} />
          </button>
          <button className="p-1">
            <Share2 className="w-6 h-6 text-[var(--tg-hint-color)]" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-28">
        {/* Title & Category */}
        <h1 className="text-2xl font-bold text-[var(--tg-text-color)] mb-2">{job.title}</h1>
        <Badge variant="secondary" className="mb-4">
          {getCategoryName(job.category)}
        </Badge>

        {/* Company */}
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-4 h-4 text-[var(--tg-hint-color)]" />
          <span className="text-[var(--tg-text-color)]">{job.companyName}</span>
          {job.companyRating && (
            <div className="flex items-center gap-1 ml-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm text-[var(--tg-hint-color)]">{job.companyRating}</span>
            </div>
          )}
        </div>

        {/* Payment Card */}
        <Card className="mb-4 bg-[var(--tg-button-color)]/5 border-[var(--tg-button-color)]/20">
          <CardContent className="p-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[var(--tg-button-color)]">
                {job.payment?.toLocaleString()}
              </span>
              <span className="text-lg text-[var(--tg-button-color)]">₸</span>
              <span className="text-sm text-[var(--tg-hint-color)] ml-1">
                {job.paymentType === 'daily' ? t(language, 'jobCard.perDay') : t(language, 'jobCard.perShift')}
              </span>
            </div>
            <p className="text-sm text-[var(--tg-hint-color)] mt-1">
              {t(language, 'jobCard.when')}: {t(language, `paymentSchedules.${job.paymentSchedule}`)}
            </p>
          </CardContent>
        </Card>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card>
            <CardContent className="p-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--tg-button-color)] shrink-0" />
              <div>
                <p className="text-xs text-[var(--tg-hint-color)]">{t(language, 'jobCard.address')}</p>
                <p className="text-sm text-[var(--tg-text-color)] truncate">{getDistrictName(job.district)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--tg-button-color)] shrink-0" />
              <div>
                <p className="text-xs text-[var(--tg-hint-color)]">{t(language, 'jobCard.schedule')}</p>
                <p className="text-sm text-[var(--tg-text-color)]">
                  {new Date(job.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--tg-button-color)] shrink-0" />
              <div>
                <p className="text-xs text-[var(--tg-hint-color)]">{t(language, 'jobCard.schedule')}</p>
                <p className="text-sm text-[var(--tg-text-color)]">{job.startTime?.slice(0,5)} — {job.endTime?.slice(0,5)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--tg-button-color)] shrink-0" />
              <div>
                <p className="text-xs text-[var(--tg-hint-color)]">{t(language, 'jobCard.spotsLeft')}</p>
                <p className="text-sm text-[var(--tg-text-color)]">{spotsLeft > 0 ? spotsLeft : 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.experienceRequired ? (
            <Badge variant="outline" className="gap-1 text-amber-600 border-amber-300">
              <Award className="w-3 h-3" /> {t(language, 'jobCard.experience')}
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-300">
              <Zap className="w-3 h-3" /> {t(language, 'jobCard.noExperience')}
            </Badge>
          )}
          {job.documentsRequired ? (
            <Badge variant="outline" className="gap-1 text-amber-600 border-amber-300">
              <FileText className="w-3 h-3" /> {t(language, 'jobCard.documents')}
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-300">
              <FileText className="w-3 h-3" /> {t(language, 'jobCard.noDocuments')}
            </Badge>
          )}
        </div>

        <Separator className="my-4" />

        {/* Description */}
        {job.description && (
          <div className="mb-4">
            <h3 className="font-semibold text-[var(--tg-text-color)] mb-2">
              {t(language, 'jobCard.description')}
            </h3>
            <p className="text-sm text-[var(--tg-hint-color)] leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>
        )}

        {/* Requirements */}
        {job.requirements && (
          <div className="mb-4">
            <h3 className="font-semibold text-[var(--tg-text-color)] mb-2">
              {t(language, 'jobCard.requirements')}
            </h3>
            <p className="text-sm text-[var(--tg-hint-color)] leading-relaxed whitespace-pre-line">
              {job.requirements}
            </p>
          </div>
        )}
      </div>

      {/* Sticky Apply Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--tg-bg-color)] border-t border-[var(--tg-secondary-bg-color)] safe-bottom">
        <div className="max-w-md mx-auto">
          {error && <p className="text-sm text-[var(--tg-destructive-text-color)] text-center mb-2">{error}</p>}
          {hasApplied ? (
            <Button disabled className="w-full min-h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-600">
              {t(language, 'jobCard.applied')}
            </Button>
          ) : !user?.phoneVerified ? (
            <div>
              <Button disabled className="w-full min-h-12 text-base font-semibold">
                {t(language, 'jobCard.apply')}
              </Button>
              <p className="text-xs text-center text-[var(--tg-destructive-text-color)] mt-1">
                {t(language, 'phoneVerification.description')}
              </p>
            </div>
          ) : (
            <Button
              className="w-full min-h-12 text-base font-semibold bg-[var(--tg-button-color)] hover:bg-[var(--tg-button-color)]/90 text-[var(--tg-button-text-color)]"
              onClick={handleApply}
              disabled={isApplying}
            >
              {t(language, 'jobCard.apply')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
