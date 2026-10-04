import type { Language } from '../../contexts/LanguageContext';
import type { ServiceKey } from '../../data/services-config';
import { Check } from '../brand/icons';
import { container, getT, Kicker, sectionY, SectionTitle } from '../home/shared';
import MoreText from './MoreText';
import { serviceTint, TypeIcon } from './meta';

/** Пронумерованные ключи «services.X.cards.N.*» / «features.N.*» — пока перевод находится. */
function collect<TItem>(build: (i: number) => TItem | null): TItem[] {
  const out: TItem[] = [];
  for (let i = 0; i < 12; i++) {
    const item = build(i);
    if (!item) break;
    out.push(item);
  }
  return out;
}

export default function ServiceTypes({ lang, service }: { lang: Language; service: ServiceKey }) {
  const t = getT(lang);
  const tint = serviceTint[service];
  const cards = collect((i) => {
    const key = `services.${service}.cards.${i}.title`;
    const title = t(key);
    if (title === key) return null;
    const extendedKey = `services.${service}.cards.${i}.extended`;
    const extended = t(extendedKey);
    return { title, description: t(`services.${service}.cards.${i}.description`), extended: extended === extendedKey ? '' : extended };
  });
  const featuresTitleKey = `services.${service}.features.title`;
  const featuresTitle = t(featuresTitleKey);
  const features = collect((i) => {
    const key = `services.${service}.features.${i}.title`;
    const title = t(key);
    if (title === key) return null;
    const noteKey = `services.${service}.features.${i}.note`;
    const note = t(noteKey);
    return { title, note: note === noteKey ? '' : note };
  });

  if (cards.length === 0 && features.length === 0) return null;

  return (
    <section className="bg-white">
      <div className={`${container} ${sectionY}`}>
        {cards.length > 0 && (
          <>
            <div className="flex flex-col gap-3 lg:gap-4">
              <Kicker>{t('svc.types.kicker')}</Kicker>
              <SectionTitle className="text-[#1b1f3b]">{t(`svc.types.${service}`)}</SectionTitle>
            </div>
            <div className="mt-6 grid gap-3.5 md:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
              {cards.map((card) => (
                <article key={card.title} className="flex flex-col gap-3 rounded-[22px] border border-[#efe3d5] bg-white p-5 shadow-[0_4px_14px_rgba(27,31,59,0.05)] lg:rounded-3xl lg:p-7">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px]" style={{ background: tint.bg, color: tint.ink }}>
                    <TypeIcon title={card.title} />
                  </span>
                  <h3 className="text-lg leading-[1.25] tracking-[-0.015em] text-[#1b1f3b] lg:text-[21px]">{card.title}</h3>
                  <p className="text-[15px] leading-[1.55] text-[#464a66]">{card.description}</p>
                  {card.extended && (
                    <MoreText text={card.extended} label={card.title} moreLabel={t('about.services.more')} lessLabel={t('about.services.hide')} />
                  )}
                </article>
              ))}
            </div>
          </>
        )}

        {features.length > 0 && featuresTitle !== featuresTitleKey && (
          <div className="mt-3.5 rounded-[22px] bg-[#fff7ef] p-5 md:mt-5 md:rounded-3xl md:p-8">
            <h3 className="text-lg tracking-[-0.015em] text-[#1b1f3b] md:text-[22px]">{featuresTitle.replace(/:$/, '')}</h3>
            <ul className="mt-4 grid gap-3 md:mt-[22px] md:grid-cols-2 md:gap-x-8 md:gap-y-4">
              {features.map((feature) => (
                <li key={feature.title} className="flex items-start gap-2.5 md:gap-3">
                  <span className="mt-px grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-[#b4232c] text-white md:h-6 md:w-6">
                    <Check className="h-[13px] w-[13px] md:h-3.5 md:w-3.5" />
                  </span>
                  <span className="text-[15px] font-medium text-[#1b1f3b] md:text-base">
                    {feature.title}
                    {feature.note && <span className="mt-0.5 block text-sm font-normal text-[#62667f]">{feature.note}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
