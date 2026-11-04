'use client';

import { useMemo, useState } from 'react';
import {
  CALC_OPTIONS,
  CALC_TYPES,
  calcEstimate,
  formatTenge,
  type CalcOptionKey,
  type CalcTypeKey,
} from '../../data/price-calculator';
import { analyticsEvents } from '../../lib/analytics';
import { buildWhatsAppUrl, PRIMARY_WHATSAPP_NUMBER } from '../../lib/whatsapp';
import { Check, WhatsAppGlyph } from '../brand/icons';

const chip =
  'flex min-h-[48px] items-center gap-2.5 rounded-[14px] border-2 px-4 py-2.5 text-left text-[15px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b4232c]';
const chipOn = 'border-[#1b1f3b] bg-[#1b1f3b] text-white';
const chipOff = 'border-[#efe3d5] bg-white text-[#1b1f3b] hover:border-[#1b1f3b]';

function Box({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 ${on ? 'border-[#ffd166] bg-[#ffd166] text-[#1b1f3b]' : 'border-[#c9bfb3]'}`}
    >
      {on && <Check className="h-3 w-3" />}
    </span>
  );
}

/** Калькулятор вилки цены: тип, размер, опции, срочность → «примерно X - Y ₸» и заявка в WhatsApp с расчётом. */
export default function PriceCalculator({ sourcePath }: { sourcePath: string }) {
  const [typeKey, setTypeKey] = useState<CalcTypeKey>('corp');
  const [sizeIndex, setSizeIndex] = useState(0);
  const [options, setOptions] = useState<CalcOptionKey[]>([]);
  const [urgent, setUrgent] = useState(false);

  const type = CALC_TYPES.find((t) => t.key === typeKey) ?? CALC_TYPES[0];
  const estimate = useMemo(() => calcEstimate(typeKey, sizeIndex, options, urgent), [typeKey, sizeIndex, options, urgent]);
  const available = CALC_OPTIONS.filter((o) => type.options.includes(o.key));
  const chosen = available.filter((o) => options.includes(o.key) || type.included?.includes(o.key));

  const message = [
    'Здравствуйте! Расчёт из калькулятора на сайте:',
    `${type.name}${type.size ? `, ${type.size.question.toLowerCase()}: ${type.size.steps[sizeIndex]?.label.toLowerCase()}` : ''}`,
    chosen.length > 0 ? `Опции: ${chosen.map((o) => o.name).join(', ')}` : '',
    urgent ? 'Нужно срочно, за 1-2 недели' : '',
    `Калькулятор показал ${formatTenge(estimate.min)} - ${formatTenge(estimate.max)}. Хочу точную оценку.`,
  ]
    .filter(Boolean)
    .join('\n');
  const whatsappUrl = buildWhatsAppUrl(message, { sourcePath });

  const pickType = (key: CalcTypeKey) => {
    setTypeKey(key);
    setSizeIndex(0);
  };
  const toggle = (key: CalcOptionKey) =>
    setOptions((current) => (current.includes(key) ? current.filter((k) => k !== key) : [...current, key]));

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
      <div className="flex flex-col gap-7 rounded-[22px] bg-white p-5 shadow-[0_4px_14px_rgba(27,31,59,0.06)] sm:p-7 lg:rounded-3xl">
        <fieldset>
          <legend className="font-display text-lg font-bold tracking-[-0.015em] text-[#1b1f3b]">1. Что нужно сделать</legend>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {CALC_TYPES.map((t) => {
              const on = t.key === typeKey;
              return (
                <button key={t.key} type="button" aria-pressed={on} onClick={() => pickType(t.key)} className={`${chip} flex-col items-start gap-0.5 ${on ? chipOn : chipOff}`}>
                  <span>{t.name}</span>
                  <span className={`hidden text-[13px] font-medium sm:block ${on ? 'text-[#c3c6dd]' : 'text-[#62667f]'}`}>{t.hint}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {type.size && (
          <fieldset>
            <legend className="font-display text-lg font-bold tracking-[-0.015em] text-[#1b1f3b]">2. {type.size.question}</legend>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {type.size.steps.map((step, index) => {
                const on = index === sizeIndex;
                return (
                  <button key={step.label} type="button" aria-pressed={on} onClick={() => setSizeIndex(index)} className={`${chip} ${on ? chipOn : chipOff}`}>
                    {step.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {available.length > 0 && (
          <fieldset>
            <legend className="font-display text-lg font-bold tracking-[-0.015em] text-[#1b1f3b]">{type.size ? '3' : '2'}. Что добавить</legend>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {available.map((option) => {
                const included = type.included?.includes(option.key) ?? false;
                const on = included || options.includes(option.key);
                return (
                  <button
                    key={option.key}
                    type="button"
                    aria-pressed={on}
                    disabled={included}
                    onClick={() => toggle(option.key)}
                    className={`${chip} ${on ? chipOn : chipOff} disabled:cursor-default`}
                  >
                    <Box on={on} />
                    <span>
                      {option.name}
                      {included && <span className="block text-[13px] font-medium text-[#c3c6dd]">уже входит</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        <button type="button" aria-pressed={urgent} onClick={() => setUrgent((v) => !v)} className={`${chip} self-start ${urgent ? chipOn : chipOff}`}>
          <Box on={urgent} />
          Срочно, за 1-2 недели (×1,5)
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-[22px] bg-[#1b1f3b] p-6 text-white sm:p-8 lg:sticky lg:top-28 lg:rounded-3xl" aria-live="polite">
        <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#ffd166]">Примерная стоимость</p>
        <p className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.03em] sm:text-[36px]">
          {formatTenge(estimate.min)}
          <span className="block text-[20px] font-semibold text-[#c3c6dd] sm:text-[22px]">до {formatTenge(estimate.max)}</span>
        </p>
        <p className="text-[15px] leading-[1.55] text-[#c3c6dd]">
          <span className="font-semibold text-white">Срок:</span> {type.time}
        </p>
        <p className="border-t border-[#2e3358] pt-4 text-sm leading-[1.55] text-[#c3c6dd]">
          Нижняя граница это «Старт» по готовой структуре, верхняя это полный пакет с дизайном под вас. Точную цену назовём после созвона.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, 'astana_price_calculator')}
          className="flex h-[52px] items-center justify-center gap-2.5 rounded-[14px] bg-[#25d366] px-[22px] text-base font-bold text-[#0b3d1f] transition-colors hover:bg-[#1fb356]"
        >
          <WhatsAppGlyph className="h-5 w-5" />
          Отправить расчёт в WhatsApp
        </a>
        <p className="text-center text-[13px] text-[#c3c6dd]">Оценка и консультация бесплатны</p>
      </div>
    </div>
  );
}
