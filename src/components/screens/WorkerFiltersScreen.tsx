'use client';

import { useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t, CATEGORY_KEYS, DISTRICT_KEYS } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

export function WorkerFiltersScreen() {
  const { language, goBack, filters, setFilters, clearFilters } = useAppStore();
  const [localFilters, setLocalFilters] = useState({ ...filters });
  const [salaryFrom, setSalaryFrom] = useState('');
  const [salaryTo, setSalaryTo] = useState('');

  const handleCategoryToggle = (cat: string) => {
    setLocalFilters(prev => ({
      ...prev,
      category: prev.category === cat ? undefined : cat,
    }));
  };

  const handleDistrictToggle = (dist: string) => {
    setLocalFilters(prev => ({
      ...prev,
      district: prev.district === dist ? undefined : dist,
    }));
  };

  const handleApply = () => {
    const newFilters: Record<string, string | undefined> = { ...localFilters };
    if (salaryFrom || salaryTo) {
      newFilters.salaryRange = `${salaryFrom || '0'}-${salaryTo || '999999'}`;
    }
    setFilters(newFilters);
    goBack();
  };

  const handleReset = () => {
    setLocalFilters({});
    setSalaryFrom('');
    setSalaryTo('');
    clearFilters();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--tg-bg-color)]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--tg-bg-color)] px-4 py-3 flex items-center gap-3 border-b border-[var(--tg-secondary-bg-color)]">
        <button onClick={goBack} className="p-1">
          <ArrowLeft className="w-6 h-6 text-[var(--tg-text-color)]" />
        </button>
        <h1 className="text-lg font-semibold text-[var(--tg-text-color)]">
          {t(language, 'filters.title')}
        </h1>
        <button onClick={handleReset} className="ml-auto p-1">
          <RotateCcw className="w-5 h-5 text-[var(--tg-hint-color)]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        {/* Category */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[var(--tg-text-color)] mb-3">
            {t(language, 'filters.category')}
          </h3>
          <div className="flex flex-col gap-2">
            {CATEGORY_KEYS.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--tg-secondary-bg-color)] cursor-pointer"
              >
                <Checkbox
                  checked={localFilters.category === cat}
                  onCheckedChange={() => handleCategoryToggle(cat)}
                />
                <span className="text-[var(--tg-text-color)]">
                  {t(language, `categories.${cat}`)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="my-2" />

        {/* District */}
        <div className="mb-6 mt-4">
          <h3 className="text-sm font-semibold text-[var(--tg-text-color)] mb-3">
            {t(language, 'filters.district')}
          </h3>
          <div className="flex flex-col gap-2">
            {DISTRICT_KEYS.map((dist) => (
              <label
                key={dist}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--tg-secondary-bg-color)] cursor-pointer"
              >
                <Checkbox
                  checked={localFilters.district === dist}
                  onCheckedChange={() => handleDistrictToggle(dist)}
                />
                <span className="text-[var(--tg-text-color)]">
                  {t(language, `districts.${dist}`)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="my-2" />

        {/* Date */}
        <div className="mb-6 mt-4">
          <h3 className="text-sm font-semibold text-[var(--tg-text-color)] mb-3">
            {t(language, 'filters.date')}
          </h3>
          <Input
            type="date"
            className="min-h-11"
            value={localFilters.date || ''}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, date: e.target.value }))}
          />
        </div>

        <Separator className="my-2" />

        {/* Payment Type */}
        <div className="mb-6 mt-4">
          <h3 className="text-sm font-semibold text-[var(--tg-text-color)] mb-3">
            {t(language, 'filters.paymentType')}
          </h3>
          <RadioGroup
            value={localFilters.paymentType || ''}
            onValueChange={(value) => setLocalFilters(prev => ({
              ...prev,
              paymentType: value || undefined,
            }))}
          >
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--tg-secondary-bg-color)] cursor-pointer">
                <RadioGroupItem value="daily" />
                <span className="text-[var(--tg-text-color)]">{t(language, 'filters.daily')}</span>
              </label>
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--tg-secondary-bg-color)] cursor-pointer">
                <RadioGroupItem value="weekly" />
                <span className="text-[var(--tg-text-color)]">{t(language, 'filters.weekly')}</span>
              </label>
            </div>
          </RadioGroup>
        </div>

        <Separator className="my-2" />

        {/* Salary Range */}
        <div className="mb-6 mt-4">
          <h3 className="text-sm font-semibold text-[var(--tg-text-color)] mb-3">
            {t(language, 'filters.salaryRange')}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label className="text-xs text-[var(--tg-hint-color)]">{t(language, 'filters.from')}</Label>
              <Input
                type="number"
                placeholder="0"
                className="min-h-11 mt-1"
                value={salaryFrom}
                onChange={(e) => setSalaryFrom(e.target.value)}
              />
            </div>
            <span className="text-[var(--tg-hint-color)] mt-5">—</span>
            <div className="flex-1">
              <Label className="text-xs text-[var(--tg-hint-color)]">{t(language, 'filters.to')}</Label>
              <Input
                type="number"
                placeholder="999999"
                className="min-h-11 mt-1"
                value={salaryTo}
                onChange={(e) => setSalaryTo(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--tg-bg-color)] border-t border-[var(--tg-secondary-bg-color)] safe-bottom">
        <div className="max-w-md mx-auto">
          <Button
            className="w-full min-h-12 text-base font-semibold bg-[var(--tg-button-color)] hover:bg-[var(--tg-button-color)]/90 text-[var(--tg-button-text-color)]"
            onClick={handleApply}
          >
            {t(language, 'filters.apply')}
          </Button>
        </div>
      </div>
    </div>
  );
}
