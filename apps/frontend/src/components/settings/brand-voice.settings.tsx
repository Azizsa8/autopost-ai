import React, { FC, useEffect, useState } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { useToaster } from '@gitroom/react/toaster/toaster';

export const BrandVoiceSettings: FC = () => {
  const fetch = useFetch();
  const t = useT();
  const toast = useToaster();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    brandName: '',
    industry: '',
    tone: 'professional',
    language: 'ar',
    arabicExamples: '',
    englishExamples: '',
    competitors: '',
    keywords: '',
    avoidWords: '',
  });

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/brand-voice');
      if (res.ok) {
        const data = await res.json();
        if (data) setFormData(data);
      }
      setLoading(false);
    };
    load();
  }, []);

  const save = async () => {
    const res = await fetch('/brand-voice', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      toast.show(t('brand_voice_saved', 'Brand voice updated successfully'));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{t('brand_voice_settings', 'Brand Voice Settings')}</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{t('brand_name', 'Brand Name')}</label>
            <input
              className="p-2 rounded bg-input text-inputText border border-tableBorder"
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{t('industry', 'Industry')}</label>
            <input
              className="p-2 rounded bg-input text-inputText border border-tableBorder"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">{t('tone', 'Tone')}</label>
          <select
            className="p-2 rounded bg-input text-inputText border border-tableBorder"
            value={formData.tone}
            onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="luxury">Luxury</option>
            <option value="playful">Playful</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">{t('arabic_examples', 'Arabic Examples')}</label>
          <textarea
            className="p-2 rounded bg-input text-inputText border border-tableBorder h-24"
            value={formData.arabicExamples}
            onChange={(e) => setFormData({ ...formData, arabicExamples: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">{t('english_examples', 'English Examples')}</label>
          <textarea
            className="p-2 rounded bg-input text-inputText border border-tableBorder h-24"
            value={formData.englishExamples}
            onChange={(e) => setFormData({ ...formData, englishExamples: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">{t('competitors', 'Competitors')}</label>
          <input
            className="p-2 rounded bg-input text-inputText border border-tableBorder"
            value={formData.competitors}
            onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">{t('keywords', 'Keywords')}</label>
          <input
            className="p-2 rounded bg-input text-inputText border border-tableBorder"
            value={formData.keywords}
            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">{t('avoid_words', 'Avoid Words')}</label>
          <input
            className="p-2 rounded bg-input text-inputText border border-tableBorder"
            value={formData.avoidWords}
            onChange={(e) => setFormData({ ...formData, avoidWords: e.target.value })}
          />
        </div>

        <button
          className="mt-4 px-6 py-2 bg-btnPrimary text-white rounded-lg self-end"
          onClick={save}
        >
          {t('save_changes', 'Save Changes')}
        </button>
      </div>
    </div>
  );
};
