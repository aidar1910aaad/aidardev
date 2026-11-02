// Блоки страниц «Сложная разработка» (/ru/solutions). Раздел только на русском, тексты в app/data/solutions.ts.
// Порядок на странице решения: первый экран с ценой, возможности, цены и сроки, кейсы, вопросы, соседние решения.
import Image from 'next/image';
import { getProjectById } from '../../data/projects';
import {
  SOLUTION_GROUPS,
  SOLUTIONS,
  WORK_TERMS,
  isIndustrySolution,
  solutionBySlug,
  type Solution,
  type SolutionGroup,
  type SolutionsHubText,
} from '../../data/solutions';
import { ArrowRight, ArrowUpRight, Check } from '../brand/icons';
import RatingRow from '../home/RatingRow';
import TrackedLink from '../home/TrackedLink';
import { container, getT, Kicker, sectionY, SectionTitle, visitLabel } from '../home/shared';
import { HeroActions, HeroBreadcrumbs, type Crumb } from '../service-page/ServiceHero';

const lang = 'ru' as const;

export const solutionPath = (slug: string) => `/ru/solutions/${slug}`;

const h1Class =
  'text-[32px] leading-[1.08] tracking-[-0.035em] text-[#1b1f3b] sm:text-[42px] lg:text-[clamp(38px,3.6vw,54px)] lg:leading-[1.05]';

function CheckDot() {
  return (
    <span className="mt-px grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-[#b4232c] text-white">
      <Check className="h-[13px] w-[13px]" />
    </span>
  );
}

/** «по смете» на первом экране выглядит пусто: там пишем, когда будет смета. */
function heroTerm(term: string) {
  return term === 'по смете' ? 'смета за 24 часа' : term;
}

/** Карточка справа на первом экране: цена и срок первого уровня, главные возможности. */
function OfferCard({ solution }: { solution: Solution }) {
  const t = getT(lang);
  const first = solution.tiers[0];
  return (
    <div className="relative">
      <div className="absolute -right-6 -top-7 hidden h-28 w-28 rounded-full bg-[#ffd166] md:block" aria-hidden="true" />
      <div className="relative rounded-3xl bg-white p-6 shadow-[0_36px_80px_rgba(27,31,59,0.16)] sm:p-8">
        <p className="font-display text-lg font-bold tracking-[-0.015em] text-[#1b1f3b]">{solution.short}</p>
        <dl className="mt-5 grid grid-cols-2 gap-4 border-b border-[#efe3d5] pb-5">
          <div>
            <dt className="text-[13px] font-semibold text-[#62667f]">{t('svc.offer.price')}</dt>
            <dd className="mt-1 font-display text-[22px] font-bold leading-tight tracking-[-0.03em] text-[#1b1f3b] sm:text-[26px]">
              {first.price}
            </dd>
          </div>
          <div>
            <dt className="text-[13px] font-semibold text-[#62667f]">{t('svc.offer.time')}</dt>
            <dd className="mt-1 font-display text-[18px] font-bold leading-tight tracking-[-0.02em] text-[#1b1f3b] sm:text-[20px]">
              {heroTerm(first.term)}
            </dd>
          </div>
        </dl>
        <ul className="mt-5 flex flex-col gap-3">
          {solution.features.slice(0, 4).map((item) => (
            <li key={item} className="flex items-start gap-3 text-[15px] font-medium text-[#1b1f3b]">
              <CheckDot />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-5 flex items-center gap-2 rounded-2xl bg-[#e8faef] px-4 py-3 text-sm font-semibold text-[#0b3d1f]">
          <Check className="h-4 w-4 shrink-0" />
          Код и данные остаются у вас
        </p>
        <a href="#prices" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#b4232c] hover:text-[#8f1b23]">
          Все цены и сроки <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

export function SolutionHero({ solution, crumbs, whatsappUrl }: { solution: Solution; crumbs: Crumb[]; whatsappUrl: string }) {
  return (
    <section className="hero-bg relative overflow-hidden">
      <div className={`${container} relative pb-14 pt-[calc(4rem+16px)] lg:pb-24 lg:pt-[calc(5rem+32px)]`}>
        <HeroBreadcrumbs crumbs={crumbs} />
        <div className="mt-6 grid gap-10 lg:mt-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <div className="flex flex-col gap-[18px] lg:gap-6">
            <Kicker>{SOLUTION_GROUPS[solution.group].title}</Kicker>
            <h1 className={h1Class}>{solution.title}</h1>
            <p className="max-w-[640px] text-base leading-[1.6] text-[#464a66] lg:text-lg">{solution.lead}</p>
            <HeroActions lang={lang} whatsappUrl={whatsappUrl} source={`solution_${solution.slug}_hero`} />
            <RatingRow lang={lang} source={`2gis_solution_${solution.slug}`} />
          </div>
          <OfferCard solution={solution} />
        </div>
      </div>
    </section>
  );
}

/** Что умеет система, для кого она и с чем связывается. */
export function SolutionFeatures({ solution }: { solution: Solution }) {
  return (
    <section className="bg-white">
      <div className={`${container} ${sectionY}`}>
        <div className="flex max-w-[780px] flex-col gap-3 lg:gap-4">
          <Kicker>{solution.short}</Kicker>
          <SectionTitle className="text-[#1b1f3b]">Что умеет система</SectionTitle>
        </div>
        <ul className="mt-6 grid gap-3.5 md:grid-cols-2 lg:mt-12 lg:gap-5">
          {solution.features.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-[22px] bg-[#fff7ef] p-5 text-[15px] leading-[1.6] text-[#1b1f3b] lg:rounded-3xl lg:p-6 lg:text-base"
            >
              <CheckDot />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-2 lg:gap-12">
          <div>
            <h3 className="text-xl tracking-[-0.015em] text-[#1b1f3b] lg:text-2xl">Для кого</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {solution.audience.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] leading-[1.6] text-[#464a66] lg:text-base">
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#b4232c]" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl tracking-[-0.015em] text-[#1b1f3b] lg:text-2xl">Интеграции</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {solution.integrations.map((item) => (
                <li key={item} className="rounded-full bg-[#ffefe3] px-3.5 py-2 text-sm font-semibold text-[#1b1f3b]">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Что добавит ИИ именно в этой сфере, и ссылка на ИИ-аудит как первый шаг. */
export function SolutionAI({ solution }: { solution: Solution }) {
  if (!solution.ai?.length) return null;
  const more = isIndustrySolution(solution)
    ? { href: solutionPath('industrial-ai'), label: 'ИИ для производства и ИИ-аудит' }
    : { href: '/ru/services/ai', label: 'ИИ-решения и ИИ-аудит' };
  return (
    <section className="bg-[#1b1f3b] text-white">
      <div className={`${container} ${sectionY}`}>
        <div className="flex max-w-[780px] flex-col gap-3 lg:gap-4">
          <Kicker tone="sun">ИИ</Kicker>
          <SectionTitle className="text-white">Что добавит ИИ</SectionTitle>
          <p className="text-base leading-[1.6] text-[#c3c6dd] lg:text-[17px]">
            Встраиваем ИИ туда, где он экономит часы, а не ради моды. Начать можно с ИИ-аудита от 30 000 ₸: покажем, что окупится первым.
          </p>
        </div>
        <ul className={`mt-6 grid gap-3.5 lg:mt-12 lg:gap-5 ${solution.ai.length > 3 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
          {solution.ai.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-[22px] bg-white/[0.07] p-5 text-[15px] leading-[1.6] text-[#e6e7f0] lg:rounded-3xl lg:p-6 lg:text-base">
              <Check className="mt-1 h-4 w-4 shrink-0 text-[#ffd166]" />
              {item}
            </li>
          ))}
        </ul>
        <a
          href={more.href}
          className="mt-6 inline-flex h-[52px] items-center justify-center gap-2 rounded-[14px] border-2 border-[#ffd166] px-[22px] text-base font-bold text-[#ffd166] transition-colors hover:bg-[#ffd166] hover:text-[#1b1f3b]"
        >
          {more.label} <ArrowRight />
        </a>
      </div>
    </section>
  );
}

/** Как это работает по шагам и живой пример: что прислал клиент и что получилось. Только на подробных страницах. */
export function SolutionSteps({ solution }: { solution: Solution }) {
  if (!solution.steps?.length) return null;
  const example = solution.example;
  return (
    <section className="bg-white">
      <div className={`${container} ${sectionY}`}>
        <div className="flex max-w-[780px] flex-col gap-3 lg:gap-4">
          <Kicker>По шагам</Kicker>
          <SectionTitle className="text-[#1b1f3b]">Как это работает</SectionTitle>
        </div>
        <ol className="mt-6 grid gap-3.5 md:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
          {solution.steps.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-2 rounded-[22px] bg-[#fff7ef] p-5 lg:rounded-3xl lg:p-6">
              <span className="font-display text-sm font-bold text-[#b4232c]">Шаг {index + 1}</span>
              <h3 className="text-lg tracking-[-0.015em] text-[#1b1f3b] lg:text-xl">{step.title}</h3>
              <p className="text-[15px] leading-[1.6] text-[#464a66]">{step.text}</p>
            </li>
          ))}
        </ol>
        {example && (
          <div className="mt-10 lg:mt-14">
            <h3 className="text-xl tracking-[-0.015em] text-[#1b1f3b] lg:text-2xl">{example.title}</h3>
            <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.15fr)] lg:items-center lg:gap-6">
              <figure className="rounded-[22px] bg-[#e7f6ec] p-5 lg:rounded-3xl lg:p-7">
                <figcaption className="text-[13px] font-semibold text-[#3d5c47]">{example.inputNote}</figcaption>
                <blockquote className="mt-3 rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-[15px] leading-[1.6] text-[#1b1f3b] shadow-[0_2px_8px_rgba(27,31,59,0.06)] lg:text-base">
                  {example.input}
                </blockquote>
              </figure>
              <ArrowRight className="mx-auto h-7 w-7 rotate-90 text-[#b4232c] lg:rotate-0" />
              <figure className="rounded-[22px] bg-white p-5 shadow-[0_18px_44px_rgba(27,31,59,0.12)] lg:rounded-3xl lg:p-7">
                <dl className="flex flex-col divide-y divide-[#efe3d5]">
                  {example.output.map((row) => (
                    <div key={row.label} className="grid gap-1 py-2.5 first:pt-0 last:pb-0 sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-4">
                      <dt className="text-[13px] font-semibold text-[#62667f]">{row.label}</dt>
                      <dd className="text-[15px] leading-[1.5] text-[#1b1f3b]">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <figcaption className="mt-4 flex items-start gap-2 rounded-2xl bg-[#e8faef] px-4 py-3 text-sm font-semibold text-[#0b3d1f]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" />
                  {example.outputNote}
                </figcaption>
              </figure>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/** Как задача выглядит в разных отраслях. */
export function SolutionScenarios({ solution }: { solution: Solution }) {
  if (!solution.scenarios?.length) return null;
  return (
    <section className="bg-[#fff7ef]">
      <div className={`${container} ${sectionY}`}>
        <div className="flex max-w-[780px] flex-col gap-3 lg:gap-4">
          <Kicker>Отрасли</Kicker>
          <SectionTitle className="text-[#1b1f3b]">Как это выглядит в вашей отрасли</SectionTitle>
        </div>
        <div className="mt-6 grid gap-3.5 md:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
          {solution.scenarios.map((item) => (
            <article key={item.title} className="flex flex-col gap-2 rounded-[22px] bg-white p-5 lg:rounded-3xl lg:p-6">
              <h3 className="text-lg tracking-[-0.015em] text-[#1b1f3b] lg:text-xl">{item.title}</h3>
              <p className="text-[15px] leading-[1.6] text-[#464a66]">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Как устроено внутри: компоненты, проверки перед записью в учётную систему, безопасность. */
export function SolutionTech({ solution }: { solution: Solution }) {
  if (!solution.architecture?.length) return null;
  const lists = [
    { title: 'Проверки перед записью в 1С', items: solution.checks ?? [] },
    { title: 'Безопасность и данные', items: solution.security ?? [] },
  ].filter((list) => list.items.length > 0);
  return (
    <section className="bg-[#fff7ef]">
      <div className={`${container} ${sectionY}`}>
        <div className="flex max-w-[780px] flex-col gap-3 lg:gap-4">
          <Kicker>Архитектура</Kicker>
          <SectionTitle className="text-[#1b1f3b]">Как устроено внутри</SectionTitle>
          <p className="text-base leading-[1.6] text-[#464a66] lg:text-[17px]">Для технического директора и программиста 1С: из чего состоит система и где хранятся данные.</p>
        </div>
        <div className="mt-6 grid gap-3.5 md:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
          {solution.architecture.map((item) => (
            <article key={item.title} className="flex flex-col gap-2 rounded-[22px] bg-white p-5 lg:rounded-3xl lg:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#b4232c]">{item.label}</p>
              <h3 className="text-lg tracking-[-0.015em] text-[#1b1f3b] lg:text-xl">{item.title}</h3>
              <p className="text-[15px] leading-[1.6] text-[#464a66]">{item.text}</p>
            </article>
          ))}
        </div>
        {lists.length > 0 && (
          <div className={`mt-3.5 grid gap-3.5 lg:mt-5 lg:gap-5 ${lists.length > 1 ? 'md:grid-cols-2' : ''}`}>
            {lists.map((list) => (
              <div key={list.title} className="rounded-[22px] bg-[#1b1f3b] p-5 text-white lg:rounded-3xl lg:p-7">
                <h3 className="text-lg tracking-[-0.015em] lg:text-xl">{list.title}</h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {list.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px] leading-[1.6] text-[#e6e7f0]">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-[#ffd166]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/** Пример расчёта окупаемости с подписанными допущениями. */
export function SolutionRoi({ solution }: { solution: Solution }) {
  const roi = solution.roi;
  if (!roi) return null;
  return (
    <section className="bg-[#1b1f3b] text-white">
      <div className={`${container} ${sectionY}`}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-14">
          <div className="flex flex-col gap-3 lg:gap-4">
            <Kicker tone="sun">ROI</Kicker>
            <SectionTitle className="text-white">Сколько это экономит</SectionTitle>
            <p className="text-base leading-[1.6] text-[#c3c6dd] lg:text-[17px]">{roi.intro}</p>
            <p className="text-sm leading-[1.6] text-[#9a9db8]">{roi.note}</p>
          </div>
          <div className="rounded-[22px] bg-white p-5 text-[#1b1f3b] lg:rounded-3xl lg:p-7">
            <dl className="flex flex-col divide-y divide-[#efe3d5]">
              {roi.rows.map((row) => (
                <div key={row.label} className="flex flex-col gap-0.5 py-3 first:pt-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <dt className="text-[15px] text-[#464a66]">{row.label}</dt>
                  <dd className="text-[15px] font-semibold sm:text-right">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 rounded-2xl bg-[#e8faef] px-4 py-3 font-display text-lg font-bold leading-snug tracking-[-0.015em] text-[#0b3d1f]">
              {roi.result}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Термины и аббревиатуры простым языком. */
export function SolutionGlossary({ solution }: { solution: Solution }) {
  if (!solution.glossary?.length) return null;
  return (
    <section className="bg-white">
      <div className={`${container} ${sectionY}`}>
        <div className="flex max-w-[780px] flex-col gap-3 lg:gap-4">
          <Kicker>Термины</Kicker>
          <SectionTitle className="text-[#1b1f3b]">Словарь: IDP, OCR, LLM и другие</SectionTitle>
        </div>
        <dl className="mt-6 grid gap-x-10 gap-y-6 md:grid-cols-2 lg:mt-12">
          {solution.glossary.map((item) => (
            <div key={item.term} className="border-t border-[#efe3d5] pt-4">
              <dt className="font-display text-lg font-bold tracking-[-0.015em] text-[#1b1f3b]">{item.term}</dt>
              <dd className="mt-1.5 text-[15px] leading-[1.6] text-[#464a66]">{item.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** Пилот: план по неделям, что замеряем до и после и что нужно от клиента для старта. */
export function SolutionPilot({ solution }: { solution: Solution }) {
  if (!solution.metrics?.length && !solution.requirements?.length && !solution.plan?.length) return null;
  const lists = [
    { title: 'Что замеряем на пилоте', items: solution.metrics ?? [] },
    { title: 'Что нужно от вас', items: solution.requirements ?? [] },
  ].filter((list) => list.items.length > 0);
  return (
    <section className="bg-[#fff7ef]">
      <div className={`${container} ${sectionY}`}>
        <div className="flex max-w-[780px] flex-col gap-3 lg:gap-4">
          <Kicker>Пилот</Kicker>
          <SectionTitle className="text-[#1b1f3b]">Начинаем с пилота и замеров</SectionTitle>
          <p className="text-base leading-[1.6] text-[#464a66] lg:text-[17px]">
            Не обещаем чужих цифр. Замеряем ваши показатели до запуска и после, и по ним вы решаете, идти ли дальше.
          </p>
        </div>
        {solution.plan && (
          <ol className="mt-6 grid gap-3.5 md:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-5">
            {solution.plan.map((item) => (
              <li key={item.period} className="flex flex-col gap-2 rounded-[22px] border-t-4 border-[#b4232c] bg-white p-5 lg:rounded-3xl lg:p-6">
                <span className="text-sm font-bold text-[#b4232c]">{item.period}</span>
                <h3 className="text-lg tracking-[-0.015em] text-[#1b1f3b]">{item.title}</h3>
                <p className="text-[15px] leading-[1.6] text-[#464a66]">{item.text}</p>
              </li>
            ))}
          </ol>
        )}
        <div className={`grid gap-3.5 lg:gap-5 ${solution.plan ? 'mt-3.5 lg:mt-5' : 'mt-6 lg:mt-12'} ${lists.length > 1 ? 'md:grid-cols-2' : ''}`}>
          {lists.map((list) => (
            <div key={list.title} className="rounded-[22px] bg-white p-5 lg:rounded-3xl lg:p-7">
              <h3 className="text-lg tracking-[-0.015em] text-[#1b1f3b] lg:text-xl">{list.title}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {list.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-[1.6] text-[#1b1f3b] lg:text-base">
                    <CheckDot />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Сравнение с западными системами того же класса. Последняя строка всегда наша. */
export function SolutionCompare({ solution }: { solution: Solution }) {
  const compare = solution.compare;
  if (!compare) return null;
  return (
    <section className="bg-white">
      <div className={`${container} ${sectionY}`}>
        <div className="flex max-w-[780px] flex-col gap-3 lg:gap-4">
          <Kicker>Сравнение</Kicker>
          <SectionTitle className="text-[#1b1f3b]">Как это делают на Западе</SectionTitle>
          <p className="text-base leading-[1.6] text-[#464a66] lg:text-[17px]">{compare.intro}</p>
        </div>
        <div className="mt-6 overflow-hidden rounded-[22px] border border-[#efe3d5] lg:mt-12 lg:rounded-3xl">
          <table className="w-full border-collapse text-left">
            <thead className="hidden bg-[#fff7ef] md:table-header-group">
              <tr className="text-[13px] font-semibold text-[#62667f]">
                <th scope="col" className="px-6 py-4">Решение</th>
                <th scope="col" className="px-6 py-4">Что делает</th>
                <th scope="col" className="px-6 py-4">Цена</th>
              </tr>
            </thead>
            <tbody>
              {compare.rows.map((row, index) => {
                const ours = index === compare.rows.length - 1;
                return (
                  <tr
                    key={row.name}
                    className={`block border-t border-[#efe3d5] p-5 first:border-t-0 md:table-row md:p-0 ${ours ? 'bg-[#1b1f3b] text-white' : 'text-[#1b1f3b]'}`}
                  >
                    <th scope="row" className="block font-display text-lg font-bold tracking-[-0.015em] md:table-cell md:px-6 md:py-5 md:align-top">
                      {row.name}
                    </th>
                    <td className={`mt-1.5 block text-[15px] leading-[1.6] md:mt-0 md:table-cell md:px-6 md:py-5 md:align-top ${ours ? 'text-[#e6e7f0]' : 'text-[#464a66]'}`}>
                      {row.what}
                    </td>
                    <td className={`mt-2 block text-sm font-semibold md:mt-0 md:table-cell md:whitespace-nowrap md:px-6 md:py-5 md:align-top ${ours ? 'text-[#ffd166]' : 'text-[#b4232c]'}`}>
                      {row.price}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-[1.6] text-[#62667f]">{compare.note}</p>
      </div>
    </section>
  );
}

/** Цены и сроки по уровням и общие условия работы. Первый уровень выделен: с него обычно начинают. */
export function SolutionPrices({ solution }: { solution: Solution }) {
  return (
    <section id="prices" className="scroll-mt-24 bg-[#fff7ef]">
      <div className={`${container} ${sectionY}`}>
        <div className="flex max-w-[780px] flex-col gap-3 lg:gap-4">
          <Kicker>Стоимость</Kicker>
          <SectionTitle className="text-[#1b1f3b]">Цены и сроки</SectionTitle>
        </div>
        <div className={`mt-6 grid gap-3.5 lg:mt-12 lg:gap-5 ${solution.tiers.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
          {solution.tiers.map((tier, index) => (
            <article
              key={tier.name}
              className={`flex flex-col gap-3 rounded-[22px] p-5 lg:rounded-3xl lg:p-7 ${
                index === 0
                  ? 'bg-[#1b1f3b] text-white shadow-[0_18px_44px_rgba(27,31,59,0.25)]'
                  : 'bg-white text-[#1b1f3b] shadow-[0_4px_14px_rgba(27,31,59,0.06)]'
              }`}
            >
              <h3 className="text-lg tracking-[-0.015em] lg:text-xl">{tier.name}</h3>
              <p className="font-display text-[26px] font-bold leading-tight tracking-[-0.03em] lg:text-[30px]">{tier.price}</p>
              <p className={`text-[15px] leading-[1.6] ${index === 0 ? 'text-[#c3c6dd]' : 'text-[#464a66]'}`}>{tier.scope}</p>
              <p className={`mt-auto pt-2 text-sm font-semibold ${index === 0 ? 'text-[#ffd166]' : 'text-[#b4232c]'}`}>Срок: {tier.term}</p>
            </article>
          ))}
        </div>
        <div className="mt-3.5 rounded-[22px] bg-white p-5 md:mt-5 md:rounded-3xl md:p-8">
          <h3 className="text-lg tracking-[-0.015em] text-[#1b1f3b] md:text-[22px]">Как работаем</h3>
          <ul className="mt-4 grid gap-3 md:mt-[22px] md:grid-cols-2 md:gap-x-8 md:gap-y-3.5">
            {WORK_TERMS.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[15px] font-medium text-[#1b1f3b] md:gap-3 md:text-base">
                <CheckDot />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Кейсы из портфолио: скриншот, что сделано и ссылка, если проект открыт. */
export function SolutionCases({ solution }: { solution: Solution }) {
  if (solution.cases.length === 0) return null;
  const t = getT(lang);
  return (
    <section className="bg-[#1b1f3b] text-white">
      <div className={`${container} ${sectionY}`}>
        <div className="flex flex-col gap-3 lg:gap-4">
          <Kicker tone="sun">Кейсы</Kicker>
          <SectionTitle className="text-white">Что мы уже сделали</SectionTitle>
        </div>
        <div className={`mt-8 grid gap-4 lg:mt-12 lg:gap-6 ${solution.cases.length > 1 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:max-w-[560px]'}`}>
          {solution.cases.map((item) => {
            const project = item.projectId ? getProjectById(item.projectId) : undefined;
            const image = item.image ?? project?.image;
            return (
              <article key={item.title} className="flex flex-col overflow-hidden rounded-[22px] bg-white text-[#1b1f3b] lg:rounded-3xl">
                {image && (
                  <Image
                    src={image}
                    alt={item.title}
                    width={1024}
                    height={720}
                    sizes={solution.cases.length > 1 ? '(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 560px, 100vw'}
                    className={item.image ? 'block h-auto w-full' : 'block h-[180px] w-full object-cover object-top lg:h-[200px]'}
                  />
                )}
                <div className="flex grow flex-col gap-2 p-5 lg:p-6">
                  <h3 className="text-lg tracking-[-0.015em] lg:text-xl">{item.title}</h3>
                  <p className="text-sm leading-[1.55] text-[#464a66] lg:text-[15px]">{item.text}</p>
                  {project?.live && (
                    <TrackedLink
                      href={project.live}
                      external
                      event={{ type: 'project', name: item.title, url: project.live }}
                      className="mt-auto inline-flex items-center gap-1.5 self-start pt-2 text-sm font-bold text-[#b4232c] hover:text-[#8f1b23]"
                    >
                      {visitLabel(project.live, t)} <ArrowUpRight className="h-4 w-4" />
                    </TrackedLink>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Карточка-ссылка на решение. На странице производства сверху строка «что болит». */
export function SolutionLinkCard({ solution, showPain = false }: { solution: Solution; showPain?: boolean }) {
  return (
    <a
      href={solutionPath(solution.slug)}
      className="group flex flex-col gap-2 rounded-[22px] bg-[#fff7ef] p-5 transition-colors hover:bg-[#ffefe3] lg:rounded-3xl lg:p-6"
    >
      {showPain && solution.pain && <p className="text-[13px] font-semibold leading-[1.5] text-[#62667f]">{solution.pain}</p>}
      <h3 className="text-lg tracking-[-0.015em] text-[#1b1f3b] lg:text-xl">{solution.short}</h3>
      <p className="text-[15px] leading-[1.55] text-[#464a66]">{solution.card}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-bold text-[#b4232c] group-hover:text-[#8f1b23]">
        Подробнее <ArrowRight className="h-4 w-4" />
      </span>
    </a>
  );
}

/**
 * Решения по группам: на общей странице, странице производства и в каталоге услуг.
 * limit режет группу до первых карточек (в каталоге услуг), showPain показывает «что болит» над названием.
 */
export function SolutionGroups({
  groups,
  limit,
  showPain = false,
  linkToIndustry = true,
}: {
  groups: SolutionGroup[];
  limit?: number;
  showPain?: boolean;
  /** На самой странице производства ссылка на неё не нужна */
  linkToIndustry?: boolean;
}) {
  return (
    <div className="flex flex-col gap-10 lg:gap-14">
      {groups.map((group) => {
        const items = SOLUTIONS.filter((s) => s.group === group);
        const shown = limit ? items.slice(0, limit) : items;
        const industry = linkToIndustry && (group === 'industry' || group === 'sectors');
        return (
          <div key={group}>
            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
              <div>
                <h3 className="text-xl tracking-[-0.015em] text-[#1b1f3b] lg:text-2xl">{SOLUTION_GROUPS[group].title}</h3>
                <p className="mt-1.5 text-[15px] leading-[1.55] text-[#464a66] lg:text-base">{SOLUTION_GROUPS[group].text}</p>
              </div>
              {(industry || shown.length < items.length) && (
                <a
                  href={industry ? '/ru/solutions/industry' : '/ru/solutions'}
                  className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-[#b4232c] hover:text-[#8f1b23]"
                >
                  {industry ? 'Всё для производства' : 'Все решения'} <ArrowRight className="h-4 w-4" />
                </a>
              )}
            </div>
            <div className="mt-4 grid gap-3.5 md:grid-cols-2 lg:mt-6 lg:grid-cols-3 lg:gap-5">
              {shown.map((solution) => (
                <SolutionLinkCard key={solution.slug} solution={solution} showPain={showPain} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Соседние решения внизу страницы и ссылки на общие страницы раздела. */
export function SolutionRelated({ solution }: { solution: Solution }) {
  const related = solution.related.map(solutionBySlug).filter((s): s is Solution => Boolean(s));
  return (
    <section className="bg-white">
      <div className={`${container} py-14 lg:py-20`}>
        <SectionTitle className="text-[#1b1f3b]">Смотрите также</SectionTitle>
        <div className="mt-6 grid gap-3.5 md:grid-cols-3 lg:mt-10 lg:gap-5">
          {related.map((item) => (
            <SolutionLinkCard key={item.slug} solution={item} />
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          <a href="/ru/solutions" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#b4232c] hover:text-[#8f1b23]">
            Все решения <ArrowRight className="h-4 w-4" />
          </a>
          {isIndustrySolution(solution) && (
            <a href="/ru/solutions/industry" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#b4232c] hover:text-[#8f1b23]">
              Всё для производства <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

/** Первый экран общей страницы и страницы производства. */
export function HubHero({ hub, crumbs, whatsappUrl, source }: { hub: SolutionsHubText; crumbs: Crumb[]; whatsappUrl: string; source: string }) {
  return (
    <section className="hero-bg relative overflow-hidden">
      <div className={`${container} pb-14 pt-[calc(4rem+16px)] lg:pb-20 lg:pt-[calc(5rem+32px)]`}>
        <HeroBreadcrumbs crumbs={crumbs} />
        <div className="mt-6 flex max-w-[860px] flex-col gap-[18px] lg:mt-8 lg:gap-6">
          <Kicker>{hub.kicker}</Kicker>
          <h1 className={h1Class}>{hub.title}</h1>
          <p className="text-base leading-[1.6] text-[#464a66] lg:text-lg">{hub.lead}</p>
          <HeroActions lang={lang} whatsappUrl={whatsappUrl} source={source} />
          <RatingRow lang={lang} source={`2gis_${source}`} />
        </div>
      </div>
    </section>
  );
}
