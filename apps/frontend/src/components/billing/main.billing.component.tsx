'use client';

import { Slider } from '@gitroom/react/form/slider';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@gitroom/react/form/button';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { Subscription } from '@prisma/client';
import dayjs from 'dayjs';
import clsx from 'clsx';
import { pricing } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/pricing';
import { FAQComponent } from '@gitroom/frontend/components/billing/faq.component';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { useRouter, useSearchParams } from 'next/navigation';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { LogoutComponent } from '@gitroom/frontend/components/layout/logout.component';

export const Features: FC<{
  pack: string;
}> = (props) => {
  const { pack } = props;
  const t = useT();
  const features = useMemo(() => {
    const currentPricing = pricing[pack];
    if (!currentPricing) return [];
    
    const list = [];
    list.push(`${currentPricing.maxProfiles} ${t('billing_channels', 'channels')}`);
    list.push(`${currentPricing.maxPostsPerDay === 999999 ? t('billing_unlimited', 'Unlimited') : currentPricing.maxPostsPerDay} ${t('billing_posts_per_day', 'posts per day')}`);
    
    if (currentPricing?.ai) {
      list.push(t('billing_ai_auto_complete', 'AI auto-complete'));
    }
    return list;
  }, [pack, t]);
  
  return (
    <div className="flex flex-col gap-[10px] justify-center text-[16px] text-customColor18">
      {features.map((feature) => (
        <div key={feature} className="flex gap-[20px]">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M16.2806 9.21937C16.3504 9.28903 16.4057 9.37175 16.4434 9.46279C16.4812 9.55384 16.5006 9.65144 16.5006 9.75C16.5006 9.84856 16.4812 9.94616 16.4434 10.0372C16.4057 10.1283 16.3504 10.211 16.2806 10.2806L11.0306 15.5306C10.961 15.6004 10.8783 15.6557 10.7872 15.6934C10.6962 15.7312 10.5986 15.7506 10.5 15.7506C10.4014 15.7506 10.3038 15.7312 10.2128 15.6934C10.1218 15.6557 10.039 15.6004 9.96938 15.5306L7.71938 13.2806C7.57865 13.1399 7.49959 12.949 7.49959 12.75C7.49959 12.551 7.57865 12.3601 7.71938 12.2194C7.86011 12.0786 8.05098 11.9996 8.25 11.9996C8.44903 11.9996 8.6399 12.0786 8.78063 12.2194L10.5 13.9397L15.2194 9.21937C15.289 9.14964 15.3718 9.09432 15.4628 9.05658C15.5538 9.01884 15.6514 8.99941 15.75 8.99941C15.8486 8.99941 15.9462 9.01884 16.0372 9.05658C16.1283 9.09432 16.211 9.14964 16.2806 9.21937ZM21.75 12C21.75 13.9284 21.1782 15.8134 20.1068 17.4168C19.0355 19.0202 17.5127 20.2699 15.7312 21.0078C13.9496 21.7458 11.9892 21.9389 10.0979 21.5627C8.20656 21.1865 6.46928 20.2579 5.10571 18.8943C3.74215 17.5307 2.81355 15.7934 2.43735 13.9021C2.06114 12.0108 2.25422 10.0504 2.99218 8.26884C3.73013 6.48726 4.97982 4.96451 6.58319 3.89317C8.18657 2.82183 10.0716 2.25 12 2.25C14.585 2.25273 17.0634 3.28084 18.8913 5.10872C20.7192 6.93661 21.7473 9.41498 21.75 12ZM20.25 12C20.25 10.3683 19.7661 8.77325 18.8596 7.41655C17.9531 6.05984 16.6646 5.00242 15.1571 4.37799C13.6497 3.75357 11.9909 3.59019 10.3905 3.90852C8.79017 4.22685 7.32016 5.01259 6.16637 6.16637C5.01259 7.32015 4.22685 8.79016 3.90853 10.3905C3.5902 11.9908 3.75358 13.6496 4.378 15.1571C5.00242 16.6646 6.05984 17.9531 7.41655 18.8596C8.77326 19.7661 10.3683 20.25 12 20.25C14.1873 20.2475 16.2843 19.3775 17.8309 17.8309C19.3775 16.2843 20.2475 14.1873 20.25 12Z" fill="#06ff00" />
            </svg>
          </div>
          <div>{feature}</div>
        </div>
      ))}
    </div>
  );
};

export const MainBillingComponent: FC<{
  sub?: any;
}> = (props) => {
  const { sub } = props;
  const fetch = useFetch();
  const user = useUser();
  const router = useRouter();
  const t = useT();
  const queryParams = useSearchParams();

  const [loading, setLoading] = useState<boolean>(false);
  const [period, setPeriod] = useState<'month' | 'year'>('month');
  const [monthlyOrYearly, setMonthlyOrYearly] = useState<'on' | 'off'>('off');

  useEffect(() => {
    setPeriod(monthlyOrYearly === 'on' ? 'year' : 'month');
  }, [monthlyOrYearly]);

  const handleSubscribe = async (plan: string) => {
    setLoading(true);
    try {
      const res = await fetch('/payments/create-invoice', {
        method: 'POST',
        body: JSON.stringify({ plan, interval: period }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Subscription failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-[16px] max-w-6xl mx-auto w-full py-10">
      <div className="flex flex-row items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t('plans', 'Plans')}</h1>
        <div className="flex items-center gap-[16px] bg-newBgColor p-2 rounded-xl">
          <span className={clsx(period === 'month' ? 'text-white' : 'text-gray-400')}>{t('monthly', 'MONTHLY')}</span>
          <Slider value={monthlyOrYearly} onChange={setMonthlyOrYearly} />
          <span className={clsx(period === 'year' ? 'text-white' : 'text-gray-400')}>{t('yearly', 'YEARLY')} (2 months free)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(pricing).map(([name, values]) => (
          <div
            key={name}
            className={clsx(
              "flex-1 bg-sixth border rounded-2xl p-[24px] gap-[16px] flex flex-col transition-all",
              sub?.plan === name ? "border-btnPrimary border-2 scale-105" : "border-customColor6 hover:border-gray-500"
            )}
          >
            <div className="text-[20px] font-bold uppercase tracking-wider">{t(name, name)}</div>
            <div className="text-[38px] flex gap-[2px] items-baseline">
              <span className="text-sm font-medium mr-1">{t('sar', 'SAR')}</span>
              <span className="font-bold">
                {period === 'month' ? values.month_price : values.year_price}
              </span>
              <span className="text-[14px] text-customColor18 ml-1">
                /{period === 'month' ? t('month', 'month') : t('year', 'year')}
              </span>
            </div>
            
            <Button
              loading={loading}
              disabled={sub?.plan === name}
              className={clsx(
                "w-full py-4 rounded-xl font-bold",
                sub?.plan === name ? "bg-green-600 !text-white" : "bg-btnPrimary"
              )}
              onClick={() => handleSubscribe(name)}
            >
              {sub?.plan === name ? t('current_plan', 'Current Plan') : t('purchase', 'Purchase')}
            </Button>

            <div className="mt-4 border-t border-gray-700 pt-4">
              <Features pack={name} />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-newBgColorInner p-8 rounded-2xl border border-gray-800">
        <FAQComponent />
      </div>

      <div className="flex justify-center mt-[40px]">
        <LogoutComponent />
      </div>
    </div>
  );
};
