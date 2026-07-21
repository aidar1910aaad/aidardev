'use client';

import { FormEvent, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { analyticsEvents } from '../../lib/analytics';
import { buildWhatsAppUrl, PRIMARY_WHATSAPP_NUMBER } from '../../lib/whatsapp';
import AnimatedSection from '../common/AnimatedSection';

const DISPLAY_PHONE = '+7 706 670 36 96';

export default function ConversionContact() {
  const { t } = useLanguage();
  const [topic, setTopic] = useState('');
  const [details, setDetails] = useState('');

  const submitBrief = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const lines = [t('home.contact.baseMessage')];
    if (topic) lines.push(`${t('home.contact.topicLine')}: ${topic}`);
    if (details.trim()) lines.push(`${t('home.contact.detailsLine')}: ${details.trim()}`);
    analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, 'home_whatsapp_brief');
    window.open(buildWhatsAppUrl(lines.join('\n')), '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact" className="bg-[#2446e8] py-20 text-white sm:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16">
        <AnimatedSection animationType="slide-up">
          <div className="grid gap-8 border-b border-blue-400 pb-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">{t('home.contact.kicker')}</p>
              <h2 className="mt-5 max-w-5xl text-4xl font-semibold tracking-[-0.055em] sm:text-6xl lg:text-7xl">{t('home.contact.title')}</h2>
            </div>
            <p className="text-lg leading-8 text-blue-100 lg:col-span-4">{t('home.contact.subtitle')}</p>
          </div>
        </AnimatedSection>
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <AnimatedSection animationType="slide-up" className="lg:col-span-7">
            <form onSubmit={submitBrief} className="border border-blue-400 bg-white p-5 text-[#11110f] sm:p-8">
              <label htmlFor="contact-topic" className="mb-2 block text-sm font-bold">{t('home.contact.topic')}</label>
              <select id="contact-topic" value={topic} onChange={(event) => setTopic(event.target.value)} className="min-h-13 w-full border border-[#b8b7b0] bg-white px-4 text-base focus:border-[#2446e8] focus:outline-none focus:ring-2 focus:ring-[#2446e8]/30">
                <option value="">{t('home.contact.topicPlaceholder')}</option>
                {(['website', 'bot', 'ai', 'app'] as const).map((key) => {
                  const label = t(`home.contact.topic.${key}`);
                  return <option key={key} value={label}>{label}</option>;
                })}
              </select>
              <label htmlFor="contact-details" className="mb-2 mt-6 block text-sm font-bold">{t('home.contact.details')}</label>
              <textarea id="contact-details" value={details} onChange={(event) => setDetails(event.target.value)} placeholder={t('home.contact.detailsPlaceholder')} rows={5} className="w-full resize-y border border-[#b8b7b0] px-4 py-3 text-base focus:border-[#2446e8] focus:outline-none focus:ring-2 focus:ring-[#2446e8]/30" />
              <button type="submit" className="mt-5 flex min-h-13 w-full items-center justify-between bg-[#11110f] px-6 py-4 text-sm font-bold text-white hover:bg-[#2446e8]">
                {t('home.contact.submit')} <span aria-hidden>↗</span>
              </button>
              <p className="mt-3 text-xs leading-5 text-[#68675f]">{t('home.contact.note')}</p>
            </form>
          </AnimatedSection>
          <AnimatedSection animationType="slide-up" delay={80} className="lg:col-span-5">
            <div className="grid h-full border-l border-t border-blue-400">
              <a href={buildWhatsAppUrl(t('home.contact.baseMessage'))} target="_blank" rel="noopener noreferrer" onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, 'home_contact')} className="group flex min-h-32 items-center justify-between border-b border-r border-blue-400 p-6 hover:bg-white hover:text-[#2446e8]">
                <span><strong className="block text-xl">WhatsApp</strong><span className="mt-1 block text-sm opacity-80">{DISPLAY_PHONE}</span></span><span className="text-2xl" aria-hidden>↗</span>
              </a>
              <a href="https://t.me/opunksnoo" target="_blank" rel="noopener noreferrer" onClick={() => analyticsEvents.telegramClick()} className="group flex min-h-32 items-center justify-between border-b border-r border-blue-400 p-6 hover:bg-white hover:text-[#2446e8]">
                <span><strong className="block text-xl">{t('home.contact.telegram')}</strong><span className="mt-1 block text-sm opacity-80">@opunksnoo</span></span><span className="text-2xl" aria-hidden>↗</span>
              </a>
              <a href={`tel:+${PRIMARY_WHATSAPP_NUMBER}`} onClick={() => analyticsEvents.phoneCall(DISPLAY_PHONE, 'home_contact')} className="group flex min-h-32 items-center justify-between border-b border-r border-blue-400 p-6 hover:bg-white hover:text-[#2446e8]">
                <span><strong className="block text-xl">{t('home.contact.call')}</strong><span className="mt-1 block text-sm opacity-80">{DISPLAY_PHONE}</span></span><span className="text-2xl" aria-hidden>→</span>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
