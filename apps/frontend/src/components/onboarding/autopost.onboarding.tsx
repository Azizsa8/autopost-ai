import React, { FC, useState } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import clsx from 'clsx';
import { AddProviderComponent } from '@gitroom/frontend/components/launches/add.provider.component';
import useSWR from 'swr';

export const AutopostOnboarding: FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [step, setStep] = useState(1);
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

  const fetch = useFetch();
  const t = useT();

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      await fetch('/brand-voice', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      onFinish();
    }
  };

  const getIntegrations = async () => {
    return (await fetch('/integrations')).json();
  };
  const { data: integrationData } = useSWR('get-all-integrations-onboarding', getIntegrations);

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full p-8 bg-newBgColorInner rounded-2xl shadow-xl">
      <div className="flex justify-between items-center mb-4">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={clsx(
              'w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all',
              step >= s ? 'bg-btnPrimary text-white' : 'bg-gray-200 text-gray-500'
            )}
          >
            {s}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">{t('onboarding_step1_title', 'Brand Details')}</h2>
          <input
            className="p-3 rounded-lg bg-input text-inputText border border-tableBorder"
            placeholder="Brand Name"
            value={formData.brandName}
            onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
          />
          <input
            className="p-3 rounded-lg bg-input text-inputText border border-tableBorder"
            placeholder="Industry (e.g. Real Estate, Coffee Shop)"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          />
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">{t('onboarding_step2_title', 'Brand Voice')}</h2>
          <select
            className="p-3 rounded-lg bg-input text-inputText border border-tableBorder"
            value={formData.tone}
            onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="luxury">Luxury</option>
            <option value="playful">Playful</option>
          </select>
          <textarea
            className="p-3 rounded-lg bg-input text-inputText border border-tableBorder h-32"
            placeholder="Arabic Post Example (Optional)"
            value={formData.arabicExamples}
            onChange={(e) => setFormData({ ...formData, arabicExamples: e.target.value })}
          />
          <textarea
            className="p-3 rounded-lg bg-input text-inputText border border-tableBorder h-32"
            placeholder="English Post Example (Optional)"
            value={formData.englishExamples}
            onChange={(e) => setFormData({ ...formData, englishExamples: e.target.value })}
          />
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">{t('onboarding_step3_title', 'Competitors & Keywords')}</h2>
          <input
            className="p-3 rounded-lg bg-input text-inputText border border-tableBorder"
            placeholder="Competitor Names (comma separated)"
            value={formData.competitors}
            onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
          />
          <input
            className="p-3 rounded-lg bg-input text-inputText border border-tableBorder"
            placeholder="Brand Keywords"
            value={formData.keywords}
            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
          />
          <input
            className="p-3 rounded-lg bg-input text-inputText border border-tableBorder"
            placeholder="Words to Avoid"
            value={formData.avoidWords}
            onChange={(e) => setFormData({ ...formData, avoidWords: e.target.value })}
          />
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">{t('onboarding_step4_title', 'Connect Profiles')}</h2>
          {integrationData && (
            <AddProviderComponent
              invite={false}
              social={integrationData.social || []}
              article={integrationData.article || []}
              onboarding={true}
            />
          )}
        </div>
      )}

      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button
            className="px-6 py-2 rounded-lg border border-btnPrimary text-btnPrimary"
            onClick={() => setStep(step - 1)}
          >
            {t('back', 'Back')}
          </button>
        )}
        <button
          className="px-6 py-2 rounded-lg bg-btnPrimary text-white ml-auto"
          onClick={handleNext}
        >
          {step === 4 ? t('finish', 'Finish Setup') : t('next', 'Next')}
        </button>
      </div>
    </div>
  );
};
