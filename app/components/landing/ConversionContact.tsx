'use client';

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import { analyticsEvents, captureFirstTouchUtm, type LeadService } from '../../lib/analytics';
import {
  buildWhatsAppUrl,
  formatPhone,
  normalizePhone,
  PRIMARY_WHATSAPP_NUMBER,
  sanitizePhoneInput,
} from '../../lib/whatsapp';
import AnimatedSection from '../common/AnimatedSection';

const DISPLAY_PHONE = '+7 706 670 36 96';
const NAME_MAX_LENGTH = 100;
const PHONE_MAX_LENGTH = 24;
const TASK_MAX_LENGTH = 2000;
// Longer than the server's own backend budget (~12 s), so a slow success is not mistaken for a failure.
const SUBMIT_TIMEOUT_MS = 15_000;

/** The quick chips double as the lead's `service`. */
const serviceChips: ReadonlyArray<{ key: 'website' | 'bot' | 'ai' | 'app'; service: LeadService }> = [
  { key: 'website', service: 'websites' },
  { key: 'bot', service: 'bots' },
  { key: 'ai', service: 'ai' },
  { key: 'app', service: 'mobile' },
];

type Status = 'idle' | 'sending' | 'success' | 'error';
type FieldErrors = { name?: 'required'; phone?: 'required' | 'invalid' };

const inputClass =
  'block min-h-12 w-full border bg-white px-4 py-3 text-base text-[#11110f] placeholder:text-[#8a8980] focus:outline-none focus:ring-2';
const inputStateClass = (invalid: boolean) =>
  invalid
    ? 'border-[#b42318] focus:border-[#b42318] focus:ring-[#b42318]/25'
    : 'border-[#b8b7b0] focus:border-[#2446e8] focus:ring-[#2446e8]/30';

function WhatsAppGlyph({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface ConversionContactProps {
  /** Which form produced the lead: sent to /api/leads and to the generate_lead event. */
  source?: string;
}

export default function ConversionContact({ source = 'contact_form' }: ConversionContactProps) {
  const { language, t } = useLanguage();
  const pathname = usePathname() || '/';
  const [service, setService] = useState<LeadService | ''>('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    captureFirstTouchUtm();
  }, []);

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  const selectedChip = serviceChips.find((chip) => chip.service === service);
  const topic = selectedChip ? t(`home.contact.topic.${selectedChip.key}`) : '';

  // WhatsApp brief in the same format as before (greeting, direction, task) + the page marker.
  const briefLines = [t('home.contact.baseMessage')];
  if (topic) briefLines.push(`${t('home.contact.topicLine')}: ${topic}`);
  if (details.trim()) briefLines.push(`${t('home.contact.detailsLine')}: ${details.trim()}`);
  const briefUrl = buildWhatsAppUrl(briefLines.join('\n'), { sourcePath: pathname });

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value.slice(0, NAME_MAX_LENGTH));
    if (errors.name) setErrors((current) => ({ ...current, name: undefined }));
  };

  const onPhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhone(sanitizePhoneInput(event.target.value));
    if (errors.phone) setErrors((current) => ({ ...current, phone: undefined }));
  };

  const submitLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;
    // Honeypot is read from the DOM: bots often set field values without firing input events.
    const website = String(new FormData(event.currentTarget).get('website') ?? '');

    const normalizedPhone = normalizePhone(phone);
    const found: FieldErrors = {};
    if (!name.trim()) found.name = 'required';
    if (!phone.trim()) found.phone = 'required';
    else if (!normalizedPhone) found.phone = 'invalid';
    setErrors(found);
    if (found.name || found.phone || !normalizedPhone) {
      (found.name ? nameRef : phoneRef).current?.focus();
      return;
    }

    const leadService: LeadService = service || 'other';
    setStatus('sending');

    let delivered = false;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: normalizedPhone,
          task: details.trim(),
          service: leadService,
          source,
          page: pathname,
          lang: language,
          utm: captureFirstTouchUtm(),
          website,
        }),
        signal: controller.signal,
      });
      delivered = response.status === 201;
    } catch {
      delivered = false;
    } finally {
      window.clearTimeout(timer);
    }

    if (delivered) {
      analyticsEvents.generateLead({ source, service: leadService });
      setStatus('success');
      return;
    }

    // Not saved: hand the brief over to WhatsApp so the lead is not lost.
    // The button in the error box stays as a fallback if the browser blocks the new tab.
    setStatus('error');
    analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, 'lead_form_fallback');
    window.open(briefUrl, '_blank', 'noopener,noreferrer');
  };

  const reassurances = [
    t('home.contact.reassure.reply'),
    t('home.contact.reassure.free'),
    t('home.contact.reassure.noSpam'),
  ];

  return (
    <section id="contact" className="bg-[#2446e8] py-16 text-white sm:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16">
        <AnimatedSection animationType="slide-up">
          <div className="grid gap-6 border-b border-blue-400 pb-8 lg:grid-cols-12 lg:items-end lg:pb-10">
            <div className="lg:col-span-8">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                08 / {t('home.contact.kicker')}
              </p>
              <h2 className="mt-4 max-w-5xl text-3xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-7xl">
                {t('home.contact.title')}
              </h2>
            </div>
            <p className="text-base leading-7 text-blue-100 sm:text-lg sm:leading-8 lg:col-span-4">
              {t('home.contact.subtitle')}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection animationType="slide-up" delay={40}>
          <ul className="mt-6 grid gap-2 sm:grid-cols-3 sm:gap-3">
            {reassurances.map((item) => (
              <li key={item} className="flex items-start gap-2.5 border border-blue-400/70 bg-white/10 p-3 text-sm font-semibold leading-5">
                <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 fill-current text-blue-200" aria-hidden>
                  <path
                    fillRule="evenodd"
                    d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </AnimatedSection>

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <AnimatedSection animationType="slide-up" delay={80} className="lg:col-span-7">
            {status === 'success' ? (
              <div role="status" className="border border-blue-400 bg-white p-5 text-[#11110f] sm:p-8">
                <div className="flex items-start gap-3">
                  <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center bg-[#25D366] text-[#06231a]" aria-hidden>
                    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                      <path
                        fillRule="evenodd"
                        d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <h3
                    ref={successRef}
                    tabIndex={-1}
                    className="text-2xl font-semibold leading-tight tracking-[-0.03em] focus:outline-none sm:text-3xl"
                  >
                    {t('leadForm.success.title')}
                  </h3>
                </div>
                <p className="mt-4 text-base leading-7 text-[#68675f]">{t('leadForm.success.text')}</p>
                <a
                  href={briefUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, 'lead_form_success')}
                  className="mt-6 inline-flex min-h-12 items-center gap-3 border border-[#11110f] px-5 py-3 text-sm font-extrabold hover:bg-[#25D366] hover:text-[#06231a]"
                >
                  <WhatsAppGlyph className="h-5 w-5" />
                  {t('leadForm.whatsapp')}
                </a>
              </div>
            ) : (
              <form
                onSubmit={submitLead}
                noValidate
                aria-busy={status === 'sending'}
                className="relative border border-blue-400 bg-white p-5 text-[#11110f] sm:p-8"
              >
                <fieldset>
                  <legend className="mb-3 text-sm font-bold">
                    {t('home.contact.quickLabel')}{' '}
                    <span className="font-normal text-[#68675f]">({t('home.contact.quickOptional')})</span>
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {serviceChips.map((chip) => {
                      const selected = service === chip.service;
                      return (
                        <button
                          key={chip.key}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setService(selected ? '' : chip.service)}
                          className={`quick-chip ${selected ? 'quick-chip--selected' : ''}`}
                        >
                          {t(`home.contact.topic.${chip.key}`)}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="mb-2 block text-sm font-bold">
                      {t('leadForm.name.label')}
                    </label>
                    <input
                      ref={nameRef}
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      maxLength={NAME_MAX_LENGTH}
                      value={name}
                      onChange={onNameChange}
                      placeholder={t('leadForm.name.placeholder')}
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      className={`${inputClass} ${inputStateClass(Boolean(errors.name))}`}
                    />
                    {errors.name && (
                      <p id="contact-name-error" className="mt-1.5 text-sm font-semibold text-[#b42318]">
                        {t('leadForm.error.name')}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="mb-2 block text-sm font-bold">
                      {t('leadForm.phone.label')}
                    </label>
                    <input
                      ref={phoneRef}
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      maxLength={PHONE_MAX_LENGTH}
                      value={phone}
                      onChange={onPhoneChange}
                      onBlur={() => setPhone((value) => formatPhone(value))}
                      placeholder={t('leadForm.phone.placeholder')}
                      aria-invalid={errors.phone ? true : undefined}
                      aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
                      className={`${inputClass} ${inputStateClass(Boolean(errors.phone))}`}
                    />
                    {errors.phone && (
                      <p id="contact-phone-error" className="mt-1.5 text-sm font-semibold text-[#b42318]">
                        {errors.phone === 'required' ? t('leadForm.error.phoneRequired') : t('leadForm.error.phone')}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  aria-expanded={detailsOpen}
                  aria-controls="contact-details"
                  onClick={() => setDetailsOpen((open) => !open)}
                  className="link-underline mt-6 inline-flex min-h-11 items-center"
                >
                  {t('leadForm.task.toggle')} ({t('leadForm.optional')}) {detailsOpen ? '−' : '+'}
                </button>
                <label htmlFor="contact-details" className="sr-only">
                  {t('leadForm.task.label')}
                </label>
                <textarea
                  id="contact-details"
                  name="task"
                  value={details}
                  maxLength={TASK_MAX_LENGTH}
                  onChange={(event) => setDetails(event.target.value)}
                  placeholder={t('leadForm.task.placeholder')}
                  rows={4}
                  className={`mt-3 w-full resize-y border border-[#b8b7b0] px-4 py-3 text-base focus:border-[#2446e8] focus:outline-none focus:ring-2 focus:ring-[#2446e8]/30 ${
                    detailsOpen ? 'block' : 'hidden'
                  }`}
                />

                {/* Honeypot: off-screen for people, an ordinary field for bots. */}
                <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
                  <label htmlFor="contact-website">Website</label>
                  <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
                </div>

                {status === 'error' && (
                  <div role="alert" className="mt-6 border border-[#f3b5ad] bg-[#fff4f2] p-4">
                    <p className="text-sm font-bold text-[#b42318]">{t('leadForm.error.title')}</p>
                    <p className="mt-1 text-sm leading-6 text-[#7a271a]">{t('leadForm.error.text')}</p>
                    <a
                      href={briefUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, 'lead_form_error')}
                      className="mt-3 inline-flex min-h-11 items-center gap-2 bg-[#25D366] px-4 py-2 text-sm font-extrabold text-[#06231a] hover:bg-[#1fb356]"
                    >
                      <WhatsAppGlyph className="h-5 w-5" />
                      {t('leadForm.whatsapp')}
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="mt-6 flex min-h-14 w-full items-center justify-center gap-3 bg-[#11110f] px-6 py-4 text-base font-extrabold text-white hover:bg-[#2446e8] disabled:cursor-wait disabled:opacity-70 disabled:hover:bg-[#11110f]"
                >
                  {status === 'sending' ? t('leadForm.sending') : t('leadForm.submit')}
                  {status !== 'sending' && <span aria-hidden>→</span>}
                </button>
                <p className="mt-3 text-xs leading-5 text-[#68675f]">{t('leadForm.note')}</p>
                <p className="mt-1 text-xs leading-5 text-[#68675f]">
                  {t('leadForm.consent.before')}
                  <a href={`/${language}/privacy`} className="underline underline-offset-2 hover:text-[#2446e8]">
                    {t('leadForm.consent.link')}
                  </a>
                  {t('leadForm.consent.after')}
                </p>
              </form>
            )}
          </AnimatedSection>

          <AnimatedSection animationType="slide-up" delay={120} className="lg:col-span-5">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              {t('home.contact.orDirect')}
            </p>
            <div className="grid border-t border-blue-400">
              <a
                href={buildWhatsAppUrl(t('home.contact.baseMessage'), { sourcePath: pathname })}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, 'home_contact')}
                className="flex min-h-20 items-center justify-between gap-4 border-b border-blue-400 p-5 hover:bg-white hover:text-[#2446e8] sm:min-h-28 sm:p-6"
              >
                <span>
                  <strong className="block text-lg sm:text-xl">WhatsApp</strong>
                  <span className="mt-0.5 block text-sm opacity-80">{DISPLAY_PHONE}</span>
                </span>
                <span className="text-2xl" aria-hidden>↗</span>
              </a>
              <a
                href="https://t.me/opunksnoo"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analyticsEvents.telegramClick()}
                className="flex min-h-20 items-center justify-between gap-4 border-b border-blue-400 p-5 hover:bg-white hover:text-[#2446e8] sm:min-h-28 sm:p-6"
              >
                <span>
                  <strong className="block text-lg sm:text-xl">{t('home.contact.telegram')}</strong>
                  <span className="mt-0.5 block text-sm opacity-80">@opunksnoo</span>
                </span>
                <span className="text-2xl" aria-hidden>↗</span>
              </a>
              <a
                href={`tel:+${PRIMARY_WHATSAPP_NUMBER}`}
                onClick={() => analyticsEvents.phoneCall(DISPLAY_PHONE, 'home_contact')}
                className="flex min-h-20 items-center justify-between gap-4 border-b border-blue-400 p-5 hover:bg-white hover:text-[#2446e8] sm:min-h-28 sm:p-6"
              >
                <span>
                  <strong className="block text-lg sm:text-xl">{t('home.contact.call')}</strong>
                  <span className="mt-0.5 block text-sm opacity-80">{DISPLAY_PHONE}</span>
                </span>
                <span className="text-2xl" aria-hidden>→</span>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
