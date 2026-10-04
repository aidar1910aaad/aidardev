import type { Language } from '../../contexts/LanguageContext';
import { container, getT, Kicker, sectionY, SectionTitle } from '../home/shared';
import { parseSteps } from './meta';

/** «Как это работает»: шаги из текста services.X.process — слова не меняются, только раскладка. */
export default function ServiceSteps({ lang, processKey }: { lang: Language; processKey?: string }) {
  const t = getT(lang);
  if (!processKey || t(processKey) === processKey) return null;
  const text = t(processKey);
  const parsed = parseSteps(text);

  return (
    <section className="bg-white">
      <div className={`${container} ${sectionY}`}>
        <div className="flex flex-col gap-3 lg:gap-4">
          <Kicker>{t('services.process.title')}</Kicker>
          <SectionTitle className="text-[#1b1f3b]">{parsed?.title || t('services.process.title')}</SectionTitle>
        </div>

        {parsed ? (
          <>
            <ol className="mt-6 grid gap-3 md:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
              {parsed.steps.map((step, index) => {
                const dark = index === parsed.steps.length - 1;
                return (
                  <li
                    key={step}
                    className={`flex gap-3.5 rounded-[20px] p-[18px] lg:flex-col lg:gap-4 lg:rounded-3xl lg:p-7 ${
                      dark ? 'bg-[#1b1f3b] text-white shadow-[0_18px_44px_rgba(27,31,59,0.2)]' : 'bg-[#fff7ef] text-[#1b1f3b]'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-[13px] font-display text-base font-bold lg:h-11 lg:w-11 lg:rounded-[14px] lg:text-lg ${
                        dark ? 'bg-[#ffd166] text-[#1b1f3b]' : 'bg-[#1b1f3b] text-[#ffd166]'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <p className={`self-center text-[15px] font-medium leading-[1.5] lg:self-auto lg:text-base ${dark ? 'text-white' : 'text-[#1b1f3b]'}`}>{step}</p>
                  </li>
                );
              })}
            </ol>
            {parsed.rest.length > 0 && (
              <div className="mt-5 space-y-2 text-[15px] leading-[1.6] text-[#464a66] lg:text-base">
                {parsed.rest.map((line) => <p key={line}>{line}</p>)}
              </div>
            )}
          </>
        ) : (
          <div className="mt-6 whitespace-pre-line rounded-3xl bg-[#fff7ef] p-6 text-base leading-[1.7] text-[#464a66] lg:mt-12 lg:p-8 lg:text-lg">{text}</div>
        )}
      </div>
    </section>
  );
}
