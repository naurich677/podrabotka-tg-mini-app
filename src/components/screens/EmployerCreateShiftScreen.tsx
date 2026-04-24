'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t, CATEGORY_KEYS, DISTRICT_KEYS } from '@/lib/i18n';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';

export function EmployerCreateShiftScreen() {
  const { language, goBack } = useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    city: 'Астана',
    district: '',
    address: '',
    date: '',
    startTime: '',
    endTime: '',
    payment: '',
    paymentType: 'daily',
    paymentSchedule: 'same_day',
    workersNeeded: '',
    experienceRequired: false,
    documentsRequired: false,
  });

  const updateForm = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = t(language, 'createShift.validation.titleRequired');
    if (!form.date) newErrors.date = t(language, 'createShift.validation.dateRequired');
    if (!form.payment || Number(form.payment) <= 0) newErrors.payment = t(language, 'createShift.validation.paymentRequired');
    if (!form.workersNeeded || Number(form.workersNeeded) <= 0) newErrors.workersNeeded = t(language, 'createShift.validation.workersRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (publish: boolean) => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const response = await api.jobs.create({
        title: form.title,
        category: form.category,
        description: form.description,
        city: form.city,
        district: form.district,
        address: form.address,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        payment: Number(form.payment),
        paymentType: form.paymentType,
        paymentSchedule: form.paymentSchedule,
        workersNeeded: Number(form.workersNeeded),
        experienceRequired: form.experienceRequired,
        documentsRequired: form.documentsRequired,
        status: publish ? 'active' : 'draft',
      });
      const data = (response as Record<string, unknown>)?.data as Record<string, unknown> | undefined;
      if (publish && data?.id) {
        await api.jobs.publish(data.id as string);
      }
      goBack();
    } catch {
      // handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--tg-bg-color)]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--tg-bg-color)] px-4 py-3 flex items-center gap-3 border-b border-[var(--tg-secondary-bg-color)]">
        <button onClick={goBack} className="p-1">
          <ArrowLeft className="w-6 h-6 text-[var(--tg-text-color)]" />
        </button>
        <h1 className="text-lg font-semibold text-[var(--tg-text-color)]">
          {t(language, 'createShift.title')}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-28">
        <div className="flex flex-col gap-5">
          {/* Job Title */}
          <div>
            <Label className="text-sm font-medium text-[var(--tg-text-color)] mb-1.5 block">
              {t(language, 'createShift.jobTitle')} *
            </Label>
            <Input
              className="min-h-11"
              value={form.title}
              onChange={(e) => updateForm('title', e.target.value)}
              placeholder={t(language, 'createShift.jobTitle')}
            />
            {errors.title && <p className="text-xs text-[var(--tg-destructive-text-color)] mt-1">{errors.title}</p>}
          </div>

          {/* Category */}
          <div>
            <Label className="text-sm font-medium text-[var(--tg-text-color)] mb-1.5 block">
              {t(language, 'createShift.category')}
            </Label>
            <Select value={form.category} onValueChange={(v) => updateForm('category', v)}>
              <SelectTrigger className="min-h-11">
                <SelectValue placeholder={t(language, 'createShift.category')} />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_KEYS.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {t(language, `categories.${cat}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label className="text-sm font-medium text-[var(--tg-text-color)] mb-1.5 block">
              {t(language, 'createShift.description')}
            </Label>
            <Textarea
              className="min-h-24"
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              placeholder={t(language, 'createShift.description')}
            />
          </div>

          {/* City & District */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium text-[var(--tg-text-color)] mb-1.5 block">
                {t(language, 'createShift.city')}
              </Label>
              <Input className="min-h-11" value={form.city} disabled />
            </div>
            <div>
              <Label className="text-sm font-medium text-[var(--tg-text-color)] mb-1.5 block">
                {t(language, 'createShift.district')}
              </Label>
              <Select value={form.district} onValueChange={(v) => updateForm('district', v)}>
                <SelectTrigger className="min-h-11">
                  <SelectValue placeholder={t(language, 'createShift.district')} />
                </SelectTrigger>
                <SelectContent>
                  {DISTRICT_KEYS.map((dist) => (
                    <SelectItem key={dist} value={dist}>
                      {t(language, `districts.${dist}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address */}
          <div>
            <Label className="text-sm font-medium text-[var(--tg-text-color)] mb-1.5 block">
              {t(language, 'createShift.address')}
            </Label>
            <Input
              className="min-h-11"
              value={form.address}
              onChange={(e) => updateForm('address', e.target.value)}
              placeholder={t(language, 'createShift.address')}
            />
          </div>

          {/* Date */}
          <div>
            <Label className="text-sm font-medium text-[var(--tg-text-color)] mb-1.5 block">
              {t(language, 'createShift.date')} *
            </Label>
            <Input
              type="date"
              className="min-h-11"
              value={form.date}
              onChange={(e) => updateForm('date', e.target.value)}
            />
            {errors.date && <p className="text-xs text-[var(--tg-destructive-text-color)] mt-1">{errors.date}</p>}
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium text-[var(--tg-text-color)] mb-1.5 block">
                {t(language, 'createShift.startTime')}
              </Label>
              <Input
                type="time"
                className="min-h-11"
                value={form.startTime}
                onChange={(e) => updateForm('startTime', e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-[var(--tg-text-color)] mb-1.5 block">
                {t(language, 'createShift.endTime')}
              </Label>
              <Input
                type="time"
                className="min-h-11"
                value={form.endTime}
                onChange={(e) => updateForm('endTime', e.target.value)}
              />
            </div>
          </div>

          {/* Payment */}
          <div>
            <Label className="text-sm font-medium text-[var(--tg-text-color)] mb-1.5 block">
              {t(language, 'createShift.payment')} (₸) *
            </Label>
            <Input
              type="number"
              className="min-h-11"
              value={form.payment}
              onChange={(e) => updateForm('payment', e.target.value)}
              placeholder="0"
            />
            {errors.payment && <p className="text-xs text-[var(--tg-destructive-text-color)] mt-1">{errors.payment}</p>}
          </div>

          {/* Payment Type */}
          <div>
            <Label className="text-sm font-medium text-[var(--tg-text-color)] mb-1.5 block">
              {t(language, 'createShift.paymentType')}
            </Label>
            <RadioGroup
              value={form.paymentType}
              onValueChange={(v) => updateForm('paymentType', v)}
            >
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="daily" />
                  <span className="text-sm text-[var(--tg-text-color)]">{t(language, 'filters.daily')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="weekly" />
                  <span className="text-sm text-[var(--tg-text-color)]">{t(language, 'filters.weekly')}</span>
                </label>
              </div>
            </RadioGroup>
          </div>

          {/* Payment Schedule */}
          <div>
            <Label className="text-sm font-medium text-[var(--tg-text-color)] mb-1.5 block">
              {t(language, 'createShift.paymentSchedule')}
            </Label>
            <Select value={form.paymentSchedule} onValueChange={(v) => updateForm('paymentSchedule', v)}>
              <SelectTrigger className="min-h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="same_day">{t(language, 'paymentSchedules.same_day')}</SelectItem>
                <SelectItem value="next_day">{t(language, 'paymentSchedules.next_day')}</SelectItem>
                <SelectItem value="end_of_week">{t(language, 'paymentSchedules.end_of_week')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Workers Needed */}
          <div>
            <Label className="text-sm font-medium text-[var(--tg-text-color)] mb-1.5 block">
              {t(language, 'createShift.workersNeeded')} *
            </Label>
            <Input
              type="number"
              className="min-h-11"
              value={form.workersNeeded}
              onChange={(e) => updateForm('workersNeeded', e.target.value)}
              placeholder="1"
              min="1"
            />
            {errors.workersNeeded && <p className="text-xs text-[var(--tg-destructive-text-color)] mt-1">{errors.workersNeeded}</p>}
          </div>

          {/* Switches */}
          <Card>
            <CardContent className="p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-[var(--tg-text-color)]">{t(language, 'createShift.experienceRequired')}</Label>
                <Switch
                  checked={form.experienceRequired}
                  onCheckedChange={(v) => updateForm('experienceRequired', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-[var(--tg-text-color)]">{t(language, 'createShift.documentsRequired')}</Label>
                <Switch
                  checked={form.documentsRequired}
                  onCheckedChange={(v) => updateForm('documentsRequired', v)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--tg-bg-color)] border-t border-[var(--tg-secondary-bg-color)] safe-bottom">
        <div className="max-w-md mx-auto flex gap-3">
          <Button
            variant="outline"
            className="flex-1 min-h-12 text-base font-semibold"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
          >
            {t(language, 'createShift.saveDraft')}
          </Button>
          <Button
            className="flex-1 min-h-12 text-base font-semibold bg-[var(--tg-button-color)] hover:bg-[var(--tg-button-color)]/90 text-[var(--tg-button-text-color)]"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
          >
            {t(language, 'createShift.publish')}
          </Button>
        </div>
      </div>
    </div>
  );
}
