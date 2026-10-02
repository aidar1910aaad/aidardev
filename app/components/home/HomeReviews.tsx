import type { Language } from '../../contexts/LanguageContext';
import { reviewMain, reviewsShort, reviewsSide, TWO_GIS_REVIEWS_URL, type Review } from '../../data/reviews';
import { ArrowUpRight, Stars } from '../brand/icons';
import TrackedLink from './TrackedLink';
import { container, getT, Kicker, sectionY, SectionTitle, type T } from './shared';

function Avatar({ review, size }: { review: Review; size: 'lg' | 'md' }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full font-bold ${
        size === 'lg' ? 'h-10 w-10 text-[15px] lg:h-12 lg:w-12 lg:text-lg' : 'h-[34px] w-[34px] text-[13px] lg:h-[38px] lg:w-[38px] lg:text-[15px]'
      }`}
      style={{ background: review.avatar.bg, color: review.avatar.fg }}
    >
      {review.initial}
    </span>
  );
}

function month(review: Review, t: T) {
  return review.month === '2026-07' ? t('landing.reviews.july2026') : review.month;
}

export default function HomeReviews({ lang }: { lang: Language }) {
  const t = getT(lang);
  const source = t('landing.reviews.source');
  const button =
    'h-[52px] items-center justify-center gap-2 rounded-[14px] border-2 border-[#1b1f3b] px-[22px] text-base font-bold text-[#1b1f3b] transition-colors hover:bg-[#1b1f3b] hover:text-white';

  return (
    <section id="testimonials" className="bg-white">
      <div className={`${container} ${sectionY}`}>
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div className="flex flex-col gap-3 lg:gap-4">
            <Kicker>{t('landing.reviews.kicker')}</Kicker>
            <SectionTitle className="text-[#1b1f3b]">{t('landing.reviews.title')}</SectionTitle>
          </div>
          <TrackedLink href={TWO_GIS_REVIEWS_URL} external event={{ type: 'external', label: '2gis_reviews' }} className={`hidden md:flex ${button}`}>
            {t('landing.reviews.cta')} <ArrowUpRight />
          </TrackedLink>
        </div>

        <div className="mt-6 flex flex-col gap-3.5 lg:mt-12 lg:flex-row lg:gap-6" lang="ru">
          <figure className="flex flex-col gap-3.5 rounded-3xl bg-[#ffefe3] px-5 py-6 lg:flex-[1.2_1_0%] lg:gap-[22px] lg:rounded-[32px] lg:p-10">
            <div className="pt-3 font-serif text-[60px] leading-[0.5] text-[#b4232c] lg:pt-[18px] lg:text-[88px] lg:leading-[0.55]" aria-hidden="true">
              “
            </div>
            <blockquote className="font-display text-lg font-semibold leading-[1.45] tracking-[-0.015em] text-[#1b1f3b] lg:text-[25px] lg:leading-[1.4]">
              {reviewMain.text}
            </blockquote>
            <figcaption className="mt-auto flex items-center gap-2.5 lg:gap-3">
              <Avatar review={reviewMain} size="lg" />
              <span className="flex flex-col gap-px lg:gap-0.5">
                <span className="text-[15px] font-bold text-[#1b1f3b] lg:text-base">{reviewMain.name}</span>
                <span className="text-xs font-medium text-[#464a66] lg:text-sm" lang={lang === 'kz' ? 'kk' : lang}>
                  <Stars /> · {source} · {month(reviewMain, t)}
                </span>
              </span>
            </figcaption>
          </figure>

          <div className="flex flex-col gap-3.5 lg:flex-[1_1_0%] lg:gap-6">
            {reviewsSide.map((review) => (
              <figure key={review.id} className="flex grow flex-col gap-3 rounded-[20px] border border-[#efe3d5] bg-white p-5 lg:gap-[18px] lg:rounded-3xl lg:p-7">
                <blockquote className="text-[15px] font-medium leading-[1.55] text-[#1b1f3b] lg:text-base lg:leading-[1.6]">«{review.text}»</blockquote>
                <figcaption className="mt-auto flex items-center gap-2.5">
                  <Avatar review={review} size="md" />
                  <span className="text-[13px] font-semibold text-[#1b1f3b] lg:text-sm" lang={lang === 'kz' ? 'kk' : lang}>
                    {review.name} · <Stars /> · {month(review, t)}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="scroll-row -mx-4 mt-3.5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:mt-6 lg:grid-cols-4 lg:gap-4" lang="ru">
          {reviewsShort.map((review) => (
            <figure
              key={review.id}
              className="flex w-[236px] shrink-0 snap-start flex-col gap-2.5 rounded-[18px] bg-[#fff7ef] p-[18px] md:w-auto lg:gap-3 lg:rounded-[20px] lg:px-[22px] lg:py-5"
            >
              <blockquote className="text-sm font-medium leading-[1.5] text-[#1b1f3b] lg:text-[15px] lg:leading-[1.55]">«{review.text}»</blockquote>
              <figcaption className="mt-auto text-xs font-semibold text-[#62667f] lg:text-[13px]">
                {review.name} · <Stars />
              </figcaption>
            </figure>
          ))}
        </div>

        {lang !== 'ru' && <p className="mt-4 text-xs font-medium text-[#62667f] lg:text-[13px]">{t('landing.reviews.note')}</p>}

        <TrackedLink href={TWO_GIS_REVIEWS_URL} external event={{ type: 'external', label: '2gis_reviews' }} className={`mt-5 flex md:hidden ${button}`}>
          {t('landing.reviews.cta')} <ArrowUpRight />
        </TrackedLink>
      </div>
    </section>
  );
}
