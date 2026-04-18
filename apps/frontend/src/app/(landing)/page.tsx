'use client';

import React from 'react';
import Link from 'next/link';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import clsx from 'clsx';

export default function LandingPage() {
  const t = useT();

  return (
    <div className="flex flex-col w-full">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-btnPrimary rounded-lg flex items-center justify-center">
             <span className="text-white">A</span>
          </div>
          AutoPost AI
        </div>
        <div className="flex gap-8 items-center">
          <Link href="/auth/login" className="hover:text-btnPrimary transition-colors font-medium">
            {t('login', 'Login')}
          </Link>
          <Link href="/auth/login?onboarding=true" className="bg-btnPrimary hover:bg-btnPrimary/90 px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105">
            {t('start_7_days_free_trial', 'Start 7-day Free Trial')}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-8 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-btnPrimary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-[#D82D7E]/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium mb-6 backdrop-blur-sm">
            🇸🇦 {t('designed_for_mena', 'Designed for Saudi Arabia & MENA Market')}
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            {t('hero_title', 'Automate Your Social Media with')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-btnPrimary to-[#00ff88]">AI Power</span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('hero_subtitle', 'The first social media management platform built specifically for the Middle East. High-quality Arabic content generation, Saudi brand voice alignment, and local platform integrations.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/login?onboarding=true" className="bg-btnPrimary hover:bg-btnPrimary/90 px-10 py-4 rounded-2xl text-lg font-bold transition-all shadow-lg shadow-btnPrimary/20 w-full sm:w-auto">
              {t('start_7_days_free_trial', 'Start 7-day Free Trial')}
            </Link>
            <div className="text-sm text-gray-500 font-medium">
              {t('no_credit_card_needed', 'No credit card required for trial')}
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-24 max-w-6xl mx-auto relative">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl shadow-2xl">
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0f0f0f] aspect-video flex items-center justify-center text-gray-600">
               {/* Replace with real image later */}
               <div className="text-center">
                 <p className="text-2xl font-bold mb-2">✨ AI Content Generator</p>
                 <p className="text-sm">Preview of AutoPost AI Dashboard</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-8 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">{t('why_choose_us', 'Why Choose AutoPost AI?')}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{t('features_intro', 'Built from the ground up to solve the challenges of MENA businesses.')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: t('arabic_first_ai', 'Arabic-First AI'),
                desc: t('arabic_first_desc', 'Our models are fine-tuned for high-quality Arabic dialects and Gulf brand voices. No more robotic translations.'),
                icon: '✍️'
              },
              {
                title: t('saudi_brand_voice', 'Saudi Brand Voice'),
                desc: t('saudi_brand_desc', 'Automatically align content with local cultural nuances, hashtags, and trending topics in Riyadh, Jeddah, and beyond.'),
                icon: '🇸🇦'
              },
              {
                title: t('whatsapp_integration', 'WhatsApp Business'),
                desc: t('whatsapp_desc', 'Manage your WhatsApp Business status and announcements directly alongside your social feeds.'),
                icon: '💬'
              }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-btnPrimary/50 transition-all group">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-32 px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">{t('simple_pricing', 'Simple, Transparent Pricing')}</h2>
          <p className="text-gray-400 mb-16">{t('pricing_subtitle', 'Choose the plan that fits your growth.')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Starter', 'Growth', 'Business', 'Agency'].map((plan) => (
              <div key={plan} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
                <div className="text-lg font-bold mb-2 uppercase tracking-widest text-gray-500">{plan}</div>
                <Link href="/billing" className="text-btnPrimary font-bold hover:underline">{t('view_details', 'View Details →')}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8 mb-20">
        <div className="max-w-6xl mx-auto rounded-[40px] bg-gradient-to-br from-btnPrimary to-[#00aa66] p-16 text-center relative overflow-hidden shadow-2xl shadow-btnPrimary/30">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-white">{t('ready_to_start', 'Ready to dominate the MENA social scene?')}</h2>
            <Link href="/auth/login?onboarding=true" className="bg-white text-black hover:bg-white/90 px-12 py-5 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 inline-block">
              {t('start_free_trial_now', 'Start Free Trial Now')}
            </Link>
          </div>
          {/* Decorative Pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-white/5 text-center text-gray-500">
        <p>© 2026 AutoPost AI. Built for the Middle East with ❤️</p>
      </footer>
    </div>
  );
}
