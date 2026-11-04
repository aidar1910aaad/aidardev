import Image from 'next/image';
import { projects, type Project } from '../../data/projects';
import { ASTANA_PAGES, ASTANA_PRICE_SLUG, astanaPagePath, type AstanaStep, type AstanaTier } from '../../data/astana-pages';
import { ArrowRight, ArrowUpRight, Check } from '../brand/icons';
import TrackedLink from '../home/TrackedLink';
import { container, Kicker, sectionY, SectionTitle } from '../home/shared';

/** Блоки страниц «Астана × услуга» и калькулятора: только RU, тексты из data/astana-pages.ts. */

export function AstanaTiers({ title, intro, tiers, source }: { title: string; intro: string; tiers: AstanaTier[]; source: string }) {
  const popular = tiers.length >= 3 ? 1 : -1;
  return (
    <section id="packages" className="bg-[#fff7ef]">
      <div className={`${container} ${sectionY}`}>
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div className="flex flex-col gap-3 lg:gap-4">
            <Kicker>Цены</Kicker>
            <SectionTitle className="max-w-[720px] text-[#1b1f3b]">{title}</SectionTitle>
          </div>
          <p className="max-w-[420px] text-base leading-[1.6] text-[#464a66] lg:text-[17px]">{intro}</p>
        </div>

        <div className="mt-6 grid gap-3.5 md:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
          {tiers.map((tier, index) => {
            const dark = index === popular;
            return (
              <article
                key={tier.name}
                className={`flex flex-col rounded-[22px] p-6 lg:rounded-3xl lg:p-7 ${
                  dark ? 'bg-[#1b1f3b] text-white shadow-[0_18px_44px_rgba(27,31,59,0.25)]' : 'bg-white text-[#1b1f3b] shadow-[0_4px_14px_rgba(27,31,59,0.06)]'
                }`}
              >
                <h3 className="text-xl tracking-[-0.015em] lg:text-[22px]">{tier.name}</h3>
                <p className="mt-4 font-display text-[28px] font-bold leading-tight tracking-[-0.03em] lg:text-[30px]">{tier.price}</p>
                <p className={`mt-1 text-sm font-semibold ${dark ? 'text-[#c3c6dd]' : 'text-[#62667f]'}`}>Срок: {tier.time}</p>
                <ul className={`mt-5 flex flex-col gap-2.5 border-t pt-5 ${dark ? 'border-[#2e3358]' : 'border-[#efe3d5]'}`}>
                  {tier.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[15px]">
                      <Check className={`mt-1 h-3.5 w-3.5 shrink-0 ${dark ? 'text-[#ffd166]' : 'text-[#b4232c]'}`} />
                      {item}
                    </li>
                  ))}
                </ul>
                {tier.note && <p className={`mt-4 text-sm leading-[1.55] ${dark ? 'text-[#c3c6dd]' : 'text-[#464a66]'}`}>{tier.note}</p>}
              </article>
            );
          })}
        </div>

        <TrackedLink
          href={astanaPagePath(ASTANA_PRICE_SLUG)}
          event={{ type: 'calculate', source }}
          className="mt-6 inline-flex items-center gap-2 text-[15px] font-bold text-[#b4232c] hover:text-[#8f1b23]"
        >
          Посчитать стоимость в калькуляторе <ArrowRight className="h-4 w-4" />
        </TrackedLink>
      </div>
    </section>
  );
}

export function AstanaSteps({ title, steps }: { title: string; steps: AstanaStep[] }) {
  return (
    <section className="bg-white">
      <div className={`${container} ${sectionY}`}>
        <div className="flex flex-col gap-3 lg:gap-4">
          <Kicker>Этапы</Kicker>
          <SectionTitle className="text-[#1b1f3b]">{title}</SectionTitle>
        </div>
        <ol className={`mt-6 grid gap-3.5 sm:grid-cols-2 lg:mt-12 lg:gap-5 ${steps.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-5'}`}>
          {steps.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-2 rounded-[22px] border border-[#efe3d5] p-5 lg:rounded-3xl lg:p-6">
              <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#b4232c]">Шаг {index + 1}</span>
              <h3 className="text-lg leading-[1.25] tracking-[-0.015em] text-[#1b1f3b]">{step.title}</h3>
              <p className="text-[15px] leading-[1.55] text-[#464a66]">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CaseCard({ project }: { project: Project }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[22px] bg-white text-[#1b1f3b] lg:rounded-3xl">
      <Image
        src={project.image}
        alt={project.title.ru}
        width={1024}
        height={720}
        sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
        className="block h-[180px] w-full object-cover object-top lg:h-[200px]"
      />
      <div className="flex grow flex-col gap-2 p-5 lg:p-6">
        <h3 className="text-lg tracking-[-0.015em] lg:text-xl">{project.title.ru}</h3>
        <p className="line-clamp-4 text-sm leading-[1.55] text-[#464a66] lg:text-[15px]">{project.description.ru}</p>
        {project.live && (
          <TrackedLink
            href={project.live}
            external
            event={{ type: 'project', name: project.title.ru, url: project.live }}
            className="mt-auto inline-flex items-center gap-1.5 self-start pt-2 text-sm font-bold text-[#b4232c] hover:text-[#8f1b23]"
          >
            Открыть сайт <ArrowUpRight className="h-4 w-4" />
          </TrackedLink>
        )}
      </div>
    </article>
  );
}

export function AstanaCases({ title, ids }: { title: string; ids: string[] }) {
  const list = ids.map((id) => projects.find((p) => p.id === id)).filter((p): p is Project => Boolean(p));
  if (list.length === 0) return null;
  return (
    <section className="bg-[#1b1f3b] text-white">
      <div className={`${container} ${sectionY}`}>
        <div className="flex flex-col gap-3 lg:gap-4">
          <Kicker tone="sun">Кейсы</Kicker>
          <SectionTitle className="text-white">{title}</SectionTitle>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6">
          {list.map((project) => (
            <CaseCard key={project.id} project={project} />
          ))}
        </div>
        <a
          href="/ru#projects"
          className="mt-6 inline-flex h-[52px] items-center justify-center gap-2 rounded-[14px] border-2 border-[#ffd166] px-[22px] text-base font-bold text-[#ffd166] transition-colors hover:bg-[#ffd166] hover:text-[#1b1f3b]"
        >
          Все {projects.length} проектов <ArrowRight />
        </a>
      </div>
    </section>
  );
}

/** Перелинковка: все страницы Астаны, калькулятор и главная страница города. */
export function AstanaLinks({ current }: { current: string }) {
  const links = [
    { href: '/ru/cities/astana', label: 'Создание сайтов в Астане' },
    { href: astanaPagePath(ASTANA_PRICE_SLUG), label: 'Сколько стоит сайт: калькулятор' },
    ...ASTANA_PAGES.map((page) => ({ href: astanaPagePath(page.slug), label: page.h1 })),
    { href: '/ru/cities/astana/mobile', label: 'Мобильные приложения в Астане' },
  ].filter((link) => link.href !== astanaPagePath(current));

  return (
    <section className="bg-white">
      <div className={`${container} py-12 lg:py-16`}>
        <h2 className="text-xl tracking-[-0.015em] text-[#1b1f3b] lg:text-2xl">Ещё для бизнеса Астаны</h2>
        <ul className="mt-5 flex flex-wrap gap-2.5">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#efe3d5] bg-[#fff7ef] px-4 py-2 text-[15px] font-semibold text-[#1b1f3b] transition-colors hover:border-[#b4232c] hover:text-[#b4232c]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Карточка справа на первом экране: цена и срок первого пакета этой страницы, что входит в работу. */
export function AstanaOfferCard({ label, tier, included }: { label: string; tier: AstanaTier; included: string[] }) {
  return (
    <div className="relative">
      <div className="absolute -right-6 -top-7 hidden h-28 w-28 rounded-full bg-[#ffd166] md:block" aria-hidden="true" />
      <div className="relative rounded-3xl bg-white p-6 shadow-[0_36px_80px_rgba(27,31,59,0.16)] sm:p-8">
        <p className="font-display text-lg font-bold tracking-[-0.015em] text-[#1b1f3b]">{label}</p>
        <dl className="mt-5 grid grid-cols-2 gap-4 border-b border-[#efe3d5] pb-5">
          <div>
            <dt className="text-[13px] font-semibold text-[#62667f]">Стоимость</dt>
            <dd className="mt-1 font-display text-[22px] font-bold leading-tight tracking-[-0.03em] text-[#1b1f3b] sm:text-[26px]">{tier.price}</dd>
          </div>
          <div>
            <dt className="text-[13px] font-semibold text-[#62667f]">Срок</dt>
            <dd className="mt-1 font-display text-[18px] font-bold leading-tight tracking-[-0.02em] text-[#1b1f3b] sm:text-[20px]">{tier.time}</dd>
          </div>
        </dl>
        <ul className="mt-5 flex flex-col gap-3">
          {included.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[15px] font-medium text-[#1b1f3b]">
              <span className="mt-px grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-[#b4232c] text-white">
                <Check className="h-[13px] w-[13px]" />
              </span>
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-5 flex items-center gap-2 rounded-2xl bg-[#e8faef] px-4 py-3 text-sm font-semibold text-[#0b3d1f]">
          <Check className="h-4 w-4 shrink-0" />
          Оценка и консультация бесплатны
        </p>
        <a href="#packages" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#b4232c] hover:text-[#8f1b23]">
          Все пакеты и цены <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
