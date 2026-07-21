import Link from 'next/link';
import type { CityEntry, CityLandingContent, SupportedLanguage } from '../../data/cities';

interface CityLandingHeroProps {
  city: CityEntry;
  content: CityLandingContent;
  language: SupportedLanguage;
}

export default function CityLandingHero({ city, content, language }: CityLandingHeroProps) {
  const cityName = city.name[language];
  const citiesHref = `/${language}/cities`;

  return (
    <section className="border-b border-slate-300 bg-[#f7f7f5] pt-28">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <nav className="mb-10 flex items-center gap-2 border-b border-slate-300 pb-5 text-xs uppercase tracking-[0.14em] text-slate-500">
            <span>{content.breadcrumbs.home}</span><span>/</span>
            <Link href={citiesHref} className="transition-colors hover:text-blue-700">{content.breadcrumbs.cities}</Link>
            <span>/</span><span className="text-slate-900">{cityName}</span>
          </nav>

          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-8">
            <span className="mb-7 inline-flex border border-blue-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
              {cityName} · aidardev
            </span>

          <h1 className="mb-7 text-4xl font-semibold leading-[1.03] tracking-[-0.05em] text-slate-950 sm:text-6xl md:text-7xl">
              {content.h1}
          </h1>

          <p className="mb-6 text-xl font-medium leading-8 text-blue-700 sm:text-2xl">
            {content.heroLead}
          </p>

          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            {content.heroBody}
          </p>
            </div>

          <div className="flex flex-col justify-end gap-3 md:col-span-4">
            <a
              href="#contact"
              className="w-full bg-blue-700 px-7 py-4 text-center font-semibold text-white transition-colors hover:bg-blue-800"
            >
              {content.primaryCta}
            </a>

            <a
              href="#projects"
              className="w-full border border-slate-400 bg-white px-7 py-4 text-center font-semibold text-slate-950 transition-colors hover:border-blue-700 hover:text-blue-700"
            >
                {content.secondaryCta}
            </a>
          </div>
          </div>

          <div className="mt-14 grid border-l border-t border-slate-300 md:grid-cols-3">
            {content.highlights.map((highlight, index) => (
              <div
                key={highlight}
                className="border-b border-r border-slate-300 bg-white p-6"
              >
                <span className="mb-6 block font-mono text-xs text-blue-700">0{index + 1}</span>
                <p className="leading-7 text-slate-700">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
