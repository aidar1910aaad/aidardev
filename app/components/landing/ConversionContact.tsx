'use client';

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
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
import { ArrowRight, Check, PhoneIcon, WhatsAppGlyph } from '../brand/icons';

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
  'block h-14 w-full rounded-[14px] border-[1.5px] bg-[#fffbf7] px-4 text-base text-[#1b1f3b] placeholder:text-[#8a8da6] focus:outline-none focus:ring-2';
const inputStateClass = (invalid: boolean) =>
  invalid
    ? 'border-[#b42318] focus:border-[#b42318] focus:ring-[#b42318]/25'
    : 'border-[#e8dacb] focus:border-[#1b1f3b] focus:ring-[#1b1f3b]/15';
const directLink =
  'inline-flex min-h-11 items-center gap-2 rounded-full bg-white/[0.12] px-4 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#b4232c]';

interface ConversionContactProps {
  /** Which form produced the lead: sent to /api/leads and to the generate_lead event. */
  source?: string;
  /** No top padding — for pages where the previous section already has the same cream background. */
  flushTop?: boolean;
}

export default function ConversionContact({ source = 'contact_form', flushTop = false }: ConversionContactProps) {
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

  return (
    <section id="contact" className={`bg-[#fff7ef] pb-16 lg:pb-28 ${flushTop ? '' : 'pt-16 lg:pt-28'}`}>
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[28px] bg-[#b4232c] p-5 text-white sm:p-8 lg:rounded-[32px] lg:p-16">
          <div className="pointer-events-none absolute -right-[120px] -top-[150px] h-[240px] w-[240px] rounded-full bg-[#ffd166]/25 lg:-right-[110px] lg:-top-[130px] lg:h-[360px] lg:w-[360px] lg:bg-[#ffd166]/30" aria-hidden />
          <div className="pointer-events-none absolute -bottom-[120px] -left-20 h-[260px] w-[260px] rounded-full bg-white/[0.07]" aria-hidden />

          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div className="flex flex-col gap-5">
              <h2 className="text-[28px] leading-[1.08] tracking-[-0.03em] sm:text-[36px] lg:text-[clamp(32px,3.4vw,48px)] lg:leading-[1.06]">
                {t('landing.contact.title')}
              </h2>
              <p className="text-base leading-[1.6] text-[#ffe7da] lg:text-lg">{t('landing.contact.text')}</p>
              <div className="flex items-center gap-3.5 self-start rounded-[18px] bg-white/[0.12] px-4 py-3.5">
                <Image
                  src="/team/aidar.webp"
                  alt={t('landing.contact.founderAlt')}
                  width={52}
                  height={52}
                  className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-[#ffd166] lg:h-[52px] lg:w-[52px]"
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-bold leading-snug">{t('landing.contact.founder')}</span>
                  <span className="text-[13px] font-medium leading-snug text-[#ffe7da]">{t('landing.contact.founderNote')}</span>
                </span>
              </div>
              <div>
                <p className="mb-2.5 text-[13px] font-semibold text-[#ffe7da]">{t('home.contact.orDirect')}</p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={buildWhatsAppUrl(t('home.contact.baseMessage'), { sourcePath: pathname })}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, 'home_contact')}
                    className={directLink}
                  >
                    <WhatsAppGlyph className="h-[18px] w-[18px]" />
                    WhatsApp
                  </a>
                  <a
                    href="https://t.me/opunksnoo"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => analyticsEvents.telegramClick()}
                    className={directLink}
                  >
                    Telegram · @opunksnoo
                  </a>
                  <a
                    href={`tel:+${PRIMARY_WHATSAPP_NUMBER}`}
                    onClick={() => analyticsEvents.phoneCall(DISPLAY_PHONE, 'home_contact')}
                    className={`${directLink} tabular-nums`}
                    aria-label={`${t('home.contact.call')} ${DISPLAY_PHONE}`}
                  >
                    <PhoneIcon className="h-[17px] w-[17px]" />
                    {DISPLAY_PHONE}
                  </a>
                </div>
              </div>
            </div>

            {status === 'success' ? (
              <div role="status" className="rounded-3xl bg-white p-6 text-[#1b1f3b] shadow-[0_36px_80px_rgba(27,31,59,0.28)] sm:p-8">
                <div className="flex items-start gap-3">
                  <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#25d366] text-[#0b3d1f]" aria-hidden>
                    <Check className="h-4 w-4" />
                  </span>
                  <h3 ref={successRef} tabIndex={-1} className="text-2xl leading-tight tracking-[-0.03em] focus:outline-none">
                    {t('leadForm.success.title')}
                  </h3>
                </div>
                <p className="mt-4 text-base leading-7 text-[#464a66]">{t('leadForm.success.text')}</p>
                <a
                  href={briefUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, 'lead_form_success')}
                  className="mt-6 inline-flex h-14 items-center gap-2.5 rounded-[14px] bg-[#25d366] px-6 text-base font-bold text-[#0b3d1f] hover:bg-[#1fb356]"
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
                className="relative flex flex-col rounded-3xl bg-white p-5 text-[#1b1f3b] shadow-[0_36px_80px_rgba(27,31,59,0.28)] sm:p-[30px]"
              >
                <fieldset>
                  <legend className="mb-3 text-sm font-bold">
                    {t('home.contact.quickLabel')}{' '}
                    <span className="font-medium text-[#62667f]">({t('home.contact.quickOptional')})</span>
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
                          className={`min-h-10 rounded-full px-4 text-sm font-semibold transition-colors ${
                            selected
                              ? 'border-[1.5px] border-[#1b1f3b] bg-[#1b1f3b] text-white'
                              : 'border-[1.5px] border-[#e8dacb] bg-white text-[#1b1f3b] hover:border-[#1b1f3b]'
                          }`}
                        >
                          {t(`home.contact.topic.${chip.key}`)}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
                  className="mt-4 inline-flex min-h-11 items-center self-start text-sm font-semibold text-[#b4232c] underline decoration-[#f3b5ad] underline-offset-4 hover:decoration-[#b4232c]"
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
                  className={`mt-2 w-full resize-y rounded-[14px] border-[1.5px] border-[#e8dacb] bg-[#fffbf7] px-4 py-3 text-base text-[#1b1f3b] placeholder:text-[#8a8da6] focus:border-[#1b1f3b] focus:outline-none focus:ring-2 focus:ring-[#1b1f3b]/15 ${
                    detailsOpen ? 'block' : 'hidden'
                  }`}
                />

                {/* Honeypot: off-screen for people, an ordinary field for bots. */}
                <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
                  <label htmlFor="contact-website">Website</label>
                  <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
                </div>

                {status === 'error' && (
                  <div role="alert" className="mt-4 rounded-[14px] border border-[#f3b5ad] bg-[#fff4f2] p-4">
                    <p className="text-sm font-bold text-[#b42318]">{t('leadForm.error.title')}</p>
                    <p className="mt-1 text-sm leading-6 text-[#7a271a]">{t('leadForm.error.text')}</p>
                    <a
                      href={briefUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, 'lead_form_error')}
                      className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#25d366] px-4 py-2 text-sm font-bold text-[#0b3d1f] hover:bg-[#1fb356]"
                    >
                      <WhatsAppGlyph className="h-5 w-5" />
                      {t('leadForm.whatsapp')}
                    </a>
                  </div>
                )}

                <div className="mt-4 flex gap-2.5">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="flex h-14 grow items-center justify-center gap-2.5 rounded-[14px] bg-[#1b1f3b] px-5 text-base font-bold text-white transition-colors hover:bg-[#2e3358] disabled:cursor-wait disabled:opacity-70"
                  >
                    {status === 'sending' ? t('leadForm.sending') : t('leadForm.submit')}
                    {status !== 'sending' && <ArrowRight className="h-[18px] w-[18px]" />}
                  </button>
                  <a
                    href={briefUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, 'lead_form_whatsapp')}
                    className="flex h-14 shrink-0 items-center justify-center gap-2 rounded-[14px] bg-[#25d366] px-4 text-base font-bold text-[#0b3d1f] transition-colors hover:bg-[#1fb356] sm:px-5"
                    aria-label="WhatsApp"
                  >
                    <WhatsAppGlyph className="h-5 w-5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                </div>
                <p className="mt-3 text-xs leading-5 text-[#62667f]">{t('leadForm.note')}</p>
                <p className="mt-1 text-xs leading-5 text-[#62667f]">
                  {t('leadForm.consent.before')}
                  <a href={`/${language}/privacy`} className="underline underline-offset-2 hover:text-[#b4232c]">
                    {t('leadForm.consent.link')}
                  </a>
                  {t('leadForm.consent.after')}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
