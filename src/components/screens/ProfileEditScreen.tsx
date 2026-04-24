'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t, CATEGORY_KEYS } from '@/lib/i18n';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

export function ProfileEditScreen() {
  const { language, user, goBack, setUser } = useAppStore();
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    age: '',
    about: '',
    skills: '',
    categories: '',
    companyName: '',
    businessType: '',
    binIin: '',
  });

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.profile.update({
        firstName: form.firstName,
        lastName: form.lastName,
      });
      if (user?.role === 'worker') {
        await api.profile.updateWorker({
          age: form.age ? Number(form.age) : undefined,
          about: form.about,
          skills: form.skills,
          categories: form.categories,
        });
      } else {
        await api.profile.updateEmployer({
          companyName: form.companyName,
          businessType: form.businessType,
          binIin: form.binIin,
        });
      }
      if (user) {
        setUser({
          ...user,
          firstName: form.firstName,
          lastName: form.lastName,
        });
      }
      goBack();
    } catch {
      // handle error
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--tg-bg-color)]">
      <div className="sticky top-0 z-10 bg-[var(--tg-bg-color)] px-4 py-3 flex items-center gap-3 border-b border-[var(--tg-secondary-bg-color)]">
        <button onClick={goBack} className="p-1">
          <ArrowLeft className="w-6 h-6 text-[var(--tg-text-color)]" />
        </button>
        <h1 className="text-lg font-semibold text-[var(--tg-text-color)]">
          {t(language, 'profile.edit')}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-28">
        <div className="flex flex-col gap-5">
          {/* Common fields */}
          <div>
            <Label className="text-sm font-medium text-[var(--tg-text-color)] mb-1.5 block">
              {t(language, 'profile.name')}
            </Label>
            <Input
              className="min-h-11"
              value={form.firstName}
              onChange={(e) => updateForm('firstName', e.target.value)}
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-[var(--tg-text-color)] mb-1.5 block">
              Фамилия
            </Label>
            <Input
              className="min-h-11"
              value={form.lastName}
              onChange={(e) => updateForm('lastName', e.target.value)}
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-[var(--tg-text-color)] mb-1.5 block">
              {t(language, 'profile.phone')}
            </Label>
            <Input
              type="tel"
              className="min-h-11"
              value={form.phone}
              onChange={(e) => updateForm('phone', e.target.value)}
              disabled={user?.phoneVerified}
            />
          </div>

          {/* Worker-specific fields */}
          {user?.role === 'worker' && (
            <Card>
              <CardContent className="p-4 flex flex-col gap-4">
                <div>
                  <Label className="text-sm font-medium text-[var(--tg-text-color)] mb-1.5 block">
                    {t(language, 'profile.age')}
                  </Label>
                  <Input
                    type="number"
                    className="min-h-11"
                    value={form.age}
                    onChange={(e) => updateForm('age', e.target.value)}
                    placeholder="25"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-[var(--tg-text-color)] mb-1.5 block">
                    {t(language, 'profile.about')}
                  </Label>
                  <Textarea
                    className="min-h-20"
                    value={form.about}
                    onChange={(e) => updateForm('about', e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-[var(--tg-text-color)] mb-1.5 block">
                    {t(language, 'profile.skills')}
                  </Label>
                  <Input
                    className="min-h-11"
                    value={form.skills}
                    onChange={(e) => updateForm('skills', e.target.value)}
                    placeholder="Коммуникабельность, стрессоустойчивость"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-[var(--tg-text-color)] mb-1.5 block">
                    {t(language, 'profile.categories')}
                  </Label>
                  <Select value={form.categories} onValueChange={(v) => updateForm('categories', v)}>
                    <SelectTrigger className="min-h-11">
                      <SelectValue placeholder={t(language, 'profile.categories')} />
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
              </CardContent>
            </Card>
          )}

          {/* Employer-specific fields */}
          {user?.role === 'employer' && (
            <Card>
              <CardContent className="p-4 flex flex-col gap-4">
                <div>
                  <Label className="text-sm font-medium text-[var(--tg-text-color)] mb-1.5 block">
                    {t(language, 'profile.companyName')}
                  </Label>
                  <Input
                    className="min-h-11"
                    value={form.companyName}
                    onChange={(e) => updateForm('companyName', e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-[var(--tg-text-color)] mb-1.5 block">
                    {t(language, 'profile.businessType')}
                  </Label>
                  <Input
                    className="min-h-11"
                    value={form.businessType}
                    onChange={(e) => updateForm('businessType', e.target.value)}
                    placeholder="Ресторан, Магазин, Логистика"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-[var(--tg-text-color)] mb-1.5 block">
                    {t(language, 'profile.binIin')}
                  </Label>
                  <Input
                    className="min-h-11"
                    value={form.binIin}
                    onChange={(e) => updateForm('binIin', e.target.value)}
                    placeholder="123456789012"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--tg-bg-color)] border-t border-[var(--tg-secondary-bg-color)] safe-bottom">
        <div className="max-w-md mx-auto">
          <Button
            className="w-full min-h-12 text-base font-semibold bg-[var(--tg-button-color)] hover:bg-[var(--tg-button-color)]/90 text-[var(--tg-button-text-color)]"
            onClick={handleSave}
            disabled={isSaving}
          >
            {t(language, 'profile.save')}
          </Button>
        </div>
      </div>
    </div>
  );
}
