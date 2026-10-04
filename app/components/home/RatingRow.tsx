import type { Language } from '../../contexts/LanguageContext';
import { TWO_GIS_URL } from '../../data/reviews';
import { Stars } from '../brand/icons';
import TrackedLink from './TrackedLink';
import { getT } from './shared';

const avatars = [
  { letter: 'A', bg: '#ffb088', fg: '#5a1f05' },
  { letter: 'S', bg: '#ffd166', fg: '#5c4200' },
  { letter: 'T', bg: '#9be7b4', fg: '#0b3d1f' },
  { letter: 'D', bg: '#c9c3ff', fg: '#2a1f7a' },
];

/** Аватары клиентов, пять звёзд и «5,0 в 2ГИС · 11 отзывов» со ссылкой на карточку. */
export default function RatingRow({ lang, source }: { lang: Language; source: string }) {
  const t = getT(lang);
  return (
    <div className="flex items-center gap-3 lg:gap-4">
      <div className="flex" aria-hidden="true">
        {avatars.map((avatar, index) => (
          <span
            key={avatar.letter}
            className={`grid h-[34px] w-[34px] place-items-center rounded-full border-[3px] border-[#fff7ef] text-[13px] font-bold lg:h-10 lg:w-10 lg:text-[15px] ${
              index > 0 ? '-ml-[9px] lg:-ml-2.5' : ''
            } ${index === 3 ? 'hidden lg:grid' : ''}`}
            style={{ background: avatar.bg, color: avatar.fg }}
          >
            {avatar.letter}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-0.5 lg:gap-[3px]">
        <span role="img" aria-label={t('landing.hero.ratingLabel')} className="text-sm leading-none lg:text-[15px]">
          <Stars />
        </span>
        <TrackedLink
          href={TWO_GIS_URL}
          external
          event={{ type: 'external', label: source }}
          className="text-[13px] font-semibold text-[#464a66] underline decoration-[#e5c7ae] underline-offset-4 hover:text-[#b4232c] lg:text-sm"
        >
          {t('landing.hero.rating')}
        </TrackedLink>
      </div>
    </div>
  );
}
