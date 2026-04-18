'use client';

import React, { FC, useState } from 'react';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { Button } from '@gitroom/react/form/button';
import { Textarea } from '@gitroom/react/form/textarea';
import { Select } from '@gitroom/react/form/select';
import { Checkbox } from '@gitroom/react/form/checkbox';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';

export const AiGenerateModal: FC<{
  platform: string;
  onGenerate: (data: { caption: string; imageUrl?: string }) => void;
}> = ({ platform, onGenerate }) => {
  const t = useT();
  const fetch = useFetch();
  const modals = useModals();
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState<'ar' | 'en' | 'both'>('both');
  const [generateImage, setGenerateImage] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/ai/generate-caption', {
        method: 'POST',
        body: JSON.stringify({
          platform,
          topic,
          language,
        }),
      });

      const data = await res.json();
      
      let caption = '';
      if (language === 'ar') caption = data.captionAr;
      else if (language === 'en') caption = data.captionEn;
      else caption = `${data.captionAr}\n\n${data.captionEn}`;

      if (data.hashtags?.length) {
        caption += `\n\n${data.hashtags.join(' ')}`;
      }

      let imageUrl = undefined;
      if (generateImage && data.suggestedImagePrompt) {
        const imgRes = await fetch('/ai/generate-image', {
          method: 'POST',
          body: JSON.stringify({
            prompt: data.suggestedImagePrompt,
            platform,
          }),
        });
        imageUrl = await imgRes.text();
      }

      onGenerate({ caption, imageUrl });
      modals.closeAll();
    } catch (error) {
      console.error('AI Generation failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-bold">{t('generate_with_ai', 'Generate with AI')}</h2>
      <Textarea
        label={t('what_should_post_be_about', 'What should this post be about?')}
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="e.g. New coffee shop opening in Riyadh"
      />
      <Select
        label={t('language', 'Language')}
        value={language}
        onChange={(e) => setLanguage(e.target.value as any)}
      >
        <option value="ar">Arabic</option>
        <option value="en">English</option>
        <option value="both">Both</option>
      </Select>
      <Checkbox
        label={t('generate_image', 'Generate Image')}
        checked={generateImage}
        onChange={(e) => setGenerateImage(e.target.checked)}
      />
      <div className="flex justify-end mt-4">
        <Button onClick={handleGenerate} loading={loading} disabled={!topic}>
          {t('generate', 'Generate')}
        </Button>
      </div>
    </div>
  );
};
