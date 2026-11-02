import Image from 'next/image';
import type { Language } from '../../contexts/LanguageContext';
import { projects, type Project } from '../../data/projects';
import { ArrowUpRight } from '../brand/icons';
import ShowMore from './ShowMore';
import TrackedLink from './TrackedLink';
import { container, getT, Kicker, sectionY, SectionTitle, visitLabel, type T } from './shared';

const featuredIds = ['evoil', 'boberbuild', 'ai-admin-whatsapp', 'ai-video-astana', 'karshyga', 'albakov-stroy'] as const;

function byId(id: string): Project {
  const project = projects.find((item) => item.id === id);
  if (!project) throw new Error(`Unknown project ${id}`);
  return project;
}

function title(project: Project, lang: Language, t: T) {
  const key = `landing.work.${project.id}.title`;
  const custom = t(key);
  return custom === key ? project.title[lang] : custom;
}

function VisitLink({ project, lang, t, dark }: { project: Project; lang: Language; t: T; dark?: boolean }) {
  if (!project.live) return null;
  return (
    <TrackedLink
      href={project.live}
      external
      event={{ type: 'project', name: project.title[lang], url: project.live }}
      className={`mt-1 inline-flex items-center gap-1.5 self-start text-sm font-bold transition-colors ${
        dark ? 'text-[#ffd166] hover:text-white' : 'text-[#b4232c] hover:text-[#8f1b23]'
      }`}
    >
      {visitLabel(project.live, t)}
      <ArrowUpRight className="h-4 w-4" />
    </TrackedLink>
  );
}

/** Светлая карточка: большой INPRO и две рядом с ним. */
function LightCard({ project, lang, t, big }: { project: Project; lang: Language; t: T; big?: boolean }) {
  const name = title(project, lang, t);
  const tag = t(`landing.work.${project.id}.tag`);
  return (
    <article className="flex flex-col overflow-hidden rounded-[22px] bg-white text-[#1b1f3b] lg:grow lg:rounded-3xl">
      <Image
        src={project.image}
        alt={`${name} — ${tag}`}
        width={1024}
        height={720}
        sizes={big ? '(min-width: 1024px) 640px, 100vw' : '(min-width: 1024px) 480px, 100vw'}
        className={`block w-full object-cover object-top ${big ? 'h-[210px] sm:h-[300px] lg:h-[470px]' : 'h-[170px] sm:h-[220px] lg:h-[172px]'}`}
      />
      <div className={`flex flex-col gap-[7px] p-[18px] ${big ? 'lg:gap-3 lg:px-[30px] lg:pb-[30px] lg:pt-7' : 'lg:gap-2 lg:px-6 lg:pb-6 lg:pt-5'}`}>
        <span
          className={`text-xs font-bold text-[#b4232c] lg:text-[13px] ${big ? 'lg:self-start lg:rounded-full lg:bg-[#ffefe3] lg:px-3 lg:py-1.5' : ''}`}
        >
          {tag}
        </span>
        <h3 className={`text-xl tracking-[-0.015em] ${big ? 'lg:text-[28px] lg:tracking-[-0.02em]' : 'lg:text-[22px]'}`}>{name}</h3>
        <p className={`text-sm leading-[1.55] text-[#464a66] ${big ? 'lg:text-base lg:leading-[1.6]' : 'lg:text-[15px]'}`}>
          {t(`landing.work.${project.id}.text`)}
        </p>
        <VisitLink project={project} lang={lang} t={t} />
      </div>
    </article>
  );
}

/** Тёмная карточка: нижний ряд и раскрывающийся список. */
function DarkCard({
  project,
  lang,
  t,
  text,
  className = '',
  alwaysText,
}: {
  project: Project;
  lang: Language;
  t: T;
  text: string;
  className?: string;
  /** Показывать описание и на телефоне (в раскрытом списке). */
  alwaysText?: boolean;
}) {
  const name = title(project, lang, t);
  const tagKey = `landing.work.${project.id}.tag`;
  const tag = t(tagKey) === tagKey ? project.tech.slice(0, 2).join(' · ') : t(tagKey);
  return (
    <article className={`flex flex-col overflow-hidden rounded-[20px] bg-[#252a4d] lg:rounded-3xl ${className}`}>
      <Image
        src={project.image}
        alt={`${name} — ${tag}`}
        width={1024}
        height={720}
        sizes="(min-width: 1024px) 380px, (min-width: 768px) 33vw, 258px"
        className="block h-[130px] w-full object-cover object-top md:h-[170px] lg:h-[200px]"
      />
      <div className="flex grow flex-col gap-1 px-4 pb-4 pt-3.5 lg:gap-2 lg:px-6 lg:pb-6 lg:pt-5">
        <span className="text-xs font-bold text-[#ffd166] lg:text-[13px]">{tag}</span>
        <h3 className="text-[17px] tracking-[-0.015em] text-white lg:text-xl">{name}</h3>
        <p className={`text-sm leading-[1.55] text-[#c3c6dd] lg:text-[15px] ${alwaysText ? 'line-clamp-3' : 'hidden md:line-clamp-3'}`}>{text}</p>
        <div className="mt-auto">
          <VisitLink project={project} lang={lang} t={t} dark />
        </div>
      </div>
    </article>
  );
}

export default function HomeWork({ lang }: { lang: Language }) {
  const t = getT(lang);
  const [inpro, habipark, fida, ...rowIds] = featuredIds.map(byId);
  const rest = projects.filter((project) => !(featuredIds as readonly string[]).includes(project.id));

  return (
    <section id="projects" className="bg-[#1b1f3b] text-white">
      <div className={`${container} ${sectionY}`}>
        <div className="flex flex-col gap-3 lg:gap-4">
          <Kicker tone="sun">{t('landing.work.kicker')}</Kicker>
          <SectionTitle className="text-white">{t('landing.work.title')}</SectionTitle>
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:mt-12 lg:flex-row lg:gap-6">
          <div className="flex flex-col lg:flex-[1.35_1_0%]">
            <LightCard project={inpro} lang={lang} t={t} big />
          </div>
          <div className="flex flex-col gap-4 lg:flex-[1_1_0%] lg:gap-6">
            <LightCard project={habipark} lang={lang} t={t} />
            <LightCard project={fida} lang={lang} t={t} />
          </div>
        </div>

        <div className="scroll-row -mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:mt-6 lg:gap-6">
          {rowIds.map((project) => (
            <DarkCard
              key={project.id}
              project={project}
              lang={lang}
              t={t}
              text={t(`landing.work.${project.id}.text`)}
              className="w-[258px] shrink-0 snap-start md:w-auto"
            />
          ))}
        </div>

        <ShowMore id="all-projects" moreLabel={t('landing.work.all').replace('{count}', String(projects.length))} lessLabel={t('landing.work.less')}>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:mt-6 lg:grid-cols-3 lg:gap-6">
            {rest.map((project) => (
              <DarkCard key={project.id} project={project} lang={lang} t={t} text={project.description[lang]} alwaysText />
            ))}
          </div>
        </ShowMore>
      </div>
    </section>
  );
}
