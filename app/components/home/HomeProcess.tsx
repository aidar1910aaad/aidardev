import type { Language } from '../../contexts/LanguageContext';
import { container, getT, Kicker, sectionY, SectionTitle } from './shared';

export default function HomeProcess({ lang }: { lang: Language }) {
  const t = getT(lang);
  const steps = [1, 2, 3, 4];

  return (
    <section id="process" className="bg-[#fff7ef]">
      <div className={`${container} ${sectionY}`}>
        <div className="flex flex-col gap-3 lg:gap-4">
          <Kicker>{t('landing.process.kicker')}</Kicker>
          <SectionTitle className="text-[#1b1f3b]">{t('landing.process.title')}</SectionTitle>
        </div>

        <div className="relative mt-5 lg:mt-12">
          <div className="absolute bottom-[30px] left-[37px] top-[30px] border-l-2 border-dashed border-[#e5c7ae] lg:hidden" aria-hidden="true" />
          <div className="absolute left-[50px] right-[50px] top-[50px] hidden border-t-2 border-dashed border-[#e5c7ae] lg:block" aria-hidden="true" />
          <ol className="relative grid gap-3 lg:grid-cols-4 lg:gap-5">
            {steps.map((step) => {
              const dark = step === steps.length;
              return (
                <li
                  key={step}
                  className={`flex gap-3.5 rounded-[20px] p-[18px] lg:flex-col lg:gap-3 lg:rounded-3xl lg:p-7 ${
                    dark ? 'bg-[#1b1f3b] text-white shadow-[0_18px_44px_rgba(27,31,59,0.2)]' : 'bg-white text-[#1b1f3b] shadow-[0_4px_14px_rgba(27,31,59,0.06)]'
                  }`}
                >
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-[13px] font-display text-base font-bold lg:h-11 lg:w-11 lg:rounded-[14px] lg:text-lg ${
                      dark ? 'bg-[#ffd166] text-[#1b1f3b]' : 'bg-[#1b1f3b] text-[#ffd166]'
                    }`}
                    aria-hidden="true"
                  >
                    {step}
                  </span>
                  <div className="flex flex-col gap-[5px] lg:grow lg:gap-3">
                    <h3 className="text-[17px] tracking-[-0.015em] lg:mt-1.5 lg:text-xl">{t(`landing.process.${step}.title`)}</h3>
                    <p className={`text-sm leading-[1.5] lg:text-[15px] lg:leading-[1.55] ${dark ? 'text-[#c3c6dd]' : 'text-[#464a66]'}`}>
                      {t(`landing.process.${step}.text`)}
                    </p>
                    <span className={`text-xs font-bold lg:mt-auto lg:pt-1.5 lg:text-[13px] ${dark ? 'text-[#ffd166]' : 'text-[#b4232c]'}`}>
                      {t(`landing.process.${step}.note`)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
