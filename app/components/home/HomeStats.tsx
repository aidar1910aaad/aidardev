import type { Language } from '../../contexts/LanguageContext';
import { projects } from '../../data/projects';
import { container, getT, Kicker } from './shared';

const clientIds = ['global-solar', 'inpro-engineering', 'habipark', 'fida-concrete', 'karshyga', 'helix-lab'] as const;

export default function HomeStats({ lang }: { lang: Language }) {
  const t = getT(lang);
  const stats = [
    { value: '68+', label: t('landing.stats.projects') },
    {
      value: (
        <>
          {lang === 'en' ? '5.0' : '5,0'}
          <span className="text-[19px] text-[#f5a524] lg:text-[26px]"> ★</span>
        </>
      ),
      label: t('landing.stats.rating'),
    },
    { value: '8+', label: t('landing.stats.years') },
    {
      value: (
        <>
          15<span className="text-[19px] lg:text-[26px]"> {t('landing.stats.minutes')}</span>
        </>
      ),
      label: t('landing.stats.reply'),
    },
  ];
  const clients = clientIds.map((id) => {
    const project = projects.find((item) => item.id === id);
    return { id, name: id === 'habipark' ? 'HABI PARK' : id === 'karshyga' ? 'Karshyga' : project?.title[lang] ?? id };
  });

  return (
    <section aria-label={t('landing.stats.label')} className="bg-white">
      <div className={`${container} relative -mt-[52px] lg:-mt-14`}>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[22px] bg-[#efe3d5] shadow-[0_18px_44px_rgba(27,31,59,0.12)] lg:grid-cols-4 lg:rounded-3xl">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse justify-end gap-1 bg-white p-[18px] lg:gap-1.5 lg:px-[30px] lg:py-7">
              <dt className="text-[13px] font-medium leading-[1.4] text-[#464a66] lg:text-[15px] lg:leading-[1.45]">{stat.label}</dt>
              <dd className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.03em] text-[#1b1f3b] lg:text-[44px] lg:leading-[1.05]">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className={`${container} pt-8 lg:pt-11`}>
        <Kicker tone="muted">{t('landing.clients.title')}</Kicker>
        <ul className="mt-3 grid grid-cols-2 gap-px border-y border-[#efe3d5] bg-[#efe3d5] lg:mt-[18px] lg:grid-cols-6">
          {clients.map((client, index) => (
            <li
              key={client.id}
              className={`flex flex-col gap-[3px] bg-white py-3.5 lg:gap-1 lg:py-[18px] ${index % 2 === 0 ? 'pr-3' : 'pl-3.5'} ${
                index === 0 ? 'lg:pl-0 lg:pr-5' : index === clients.length - 1 ? 'lg:pl-5 lg:pr-0' : 'lg:px-5'
              }`}
            >
              <span className="font-display text-base font-bold tracking-[-0.02em] text-[#1b1f3b] lg:text-lg">{client.name}</span>
              <span className="text-xs font-medium text-[#62667f] lg:text-[13px]">{t(`landing.clients.${client.id}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
