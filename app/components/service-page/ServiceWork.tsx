import Image from 'next/image';
import type { Language } from '../../contexts/LanguageContext';
import type { ServiceKey } from '../../data/services-config';
import { projects, type Project } from '../../data/projects';
import { ArrowRight, ArrowUpRight, Check } from '../brand/icons';
import TrackedLink from '../home/TrackedLink';
import { container, getT, Kicker, sectionY, SectionTitle, visitLabel, type T } from '../home/shared';
import { parseBullets, serviceCases } from './meta';

function VisitLink({ project, lang, t }: { project: Project; lang: Language; t: T }) {
  if (!project.live) return null;
  return (
    <TrackedLink
      href={project.live}
      external
      event={{ type: 'project', name: project.title[lang], url: project.live }}
      className="mt-auto inline-flex items-center gap-1.5 self-start pt-2 text-sm font-bold text-[#b4232c] hover:text-[#8f1b23]"
    >
      {visitLabel(project.live, t)} <ArrowUpRight className="h-4 w-4" />
    </TrackedLink>
  );
}

function ProjectCard({ project, lang, t }: { project: Project; lang: Language; t: T }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[22px] bg-white text-[#1b1f3b] lg:rounded-3xl">
      <Image
        src={project.image}
        alt={project.title[lang]}
        width={1024}
        height={720}
        sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
        className="block h-[180px] w-full object-cover object-top lg:h-[200px]"
      />
      <div className="flex grow flex-col gap-2 p-5 lg:p-6">
        <h3 className="text-lg tracking-[-0.015em] lg:text-xl">{project.title[lang]}</h3>
        <p className="line-clamp-3 text-sm leading-[1.55] text-[#464a66] lg:text-[15px]">{project.description[lang]}</p>
        <VisitLink project={project} lang={lang} t={t} />
      </div>
    </article>
  );
}

/** Один кейс крупно: скриншот (вертикальный — переписка бота) и описание. */
function FeatureCase({ project, lang, t }: { project: Project; lang: Language; t: T }) {
  return (
    <article className="grid gap-6 overflow-hidden rounded-[22px] bg-white p-5 text-[#1b1f3b] md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] md:items-center md:p-8 lg:rounded-3xl lg:gap-10">
      <div className="mx-auto w-full max-w-[260px] rounded-[30px] bg-[#14161f] p-2 shadow-[0_24px_60px_rgba(27,31,59,0.35)]">
        <Image
          src={project.image}
          alt={project.title[lang]}
          width={585}
          height={818}
          sizes="260px"
          className="block h-auto w-full rounded-[24px]"
        />
      </div>
      <div className="flex flex-col gap-3">
        <span className="self-start rounded-full bg-[#ffefe3] px-3 py-1.5 text-xs font-bold text-[#b4232c] lg:text-[13px]">{t('svc.work.case')}</span>
        <h3 className="text-2xl tracking-[-0.02em] lg:text-[28px]">{project.title[lang]}</h3>
        <p className="text-base leading-[1.6] text-[#464a66] lg:text-[17px]">{project.description[lang]}</p>
        <VisitLink project={project} lang={lang} t={t} />
      </div>
    </article>
  );
}

export default function ServiceWork({ lang, service, examplesKey }: { lang: Language; service: ServiceKey; examplesKey?: string }) {
  const t = getT(lang);
  const examplesText = examplesKey && t(examplesKey) !== examplesKey ? t(examplesKey) : '';
  const examples = examplesText ? parseBullets(examplesText) : null;
  const cases = serviceCases[service];
  const list = cases.ids.map((id) => projects.find((p) => p.id === id)).filter((p): p is Project => Boolean(p));
  if (!examples && list.length === 0) return null;

  return (
    <section className="bg-[#1b1f3b] text-white">
      <div className={`${container} ${sectionY}`}>
        <div className="flex flex-col gap-3 lg:gap-4">
          <Kicker tone="sun">{t('services.examples.title')}</Kicker>
          <SectionTitle className="text-white">{examples?.title || t('svc.work.examples')}</SectionTitle>
        </div>

        {examples && examples.items.length > 0 && (
          <ul className="mt-6 grid gap-3 md:grid-cols-2 lg:mt-10 lg:gap-4">
            {examples.items.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl bg-white/[0.07] px-4 py-3.5 text-[15px] leading-[1.5] text-[#e6e7f0] lg:text-base">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[#ffd166]" />
                {item}
              </li>
            ))}
          </ul>
        )}
        {examples && examples.items.length === 0 && examples.rest.length > 0 && (
          <p className="mt-6 whitespace-pre-line text-base leading-[1.7] text-[#c3c6dd] lg:mt-10">{examples.rest.join('\n')}</p>
        )}

        {list.length > 0 && (
          <div className="mt-10 lg:mt-14">
            <h3 className="mb-4 text-xl tracking-[-0.015em] text-white lg:mb-6 lg:text-2xl">
              {cases.kind === 'own' ? t('svc.work.own') : t('svc.work.studio')}
            </h3>
            {list.length === 1 ? (
              <FeatureCase project={list[0]} lang={lang} t={t} />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {list.map((project) => (
                  <ProjectCard key={project.id} project={project} lang={lang} t={t} />
                ))}
              </div>
            )}
            <a
              href={`/${lang}#projects`}
              className="mt-6 inline-flex h-[52px] items-center justify-center gap-2 rounded-[14px] border-2 border-[#ffd166] px-[22px] text-base font-bold text-[#ffd166] transition-colors hover:bg-[#ffd166] hover:text-[#1b1f3b]"
            >
              {t('svc.work.all').replace('{count}', String(projects.length))} <ArrowRight />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
