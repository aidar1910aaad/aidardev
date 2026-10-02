import Image from 'next/image';
import type { Language } from '../../contexts/LanguageContext';
import { buildWhatsAppUrl } from '../../lib/whatsapp';
import { TWO_GIS_URL } from '../../data/reviews';
import { ArrowRight, Check, Stars, WhatsAppGlyph } from '../brand/icons';
import TrackedLink from './TrackedLink';
import { container, getT, rich } from './shared';

const avatars = [
  { letter: 'A', bg: '#ffb088', fg: '#5a1f05' },
  { letter: 'S', bg: '#ffd166', fg: '#5c4200' },
  { letter: 'T', bg: '#9be7b4', fg: '#0b3d1f' },
  { letter: 'D', bg: '#c9c3ff', fg: '#2a1f7a' },
];

function HeroVisual({ lang }: { lang: Language }) {
  const t = getT(lang);
  const chat = [1, 2, 3, 4, 5].map((n) => ({ text: t(`landing.hero.chat.${n}`), out: n % 2 === 1 }));

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto h-[290px] w-full max-w-[358px] md:h-[580px] md:w-[552px] md:max-w-none lg:mx-0 lg:-mb-[116px] lg:origin-top-left lg:scale-[0.8] xl:mb-0 xl:scale-100"
    >
      <div
        className="absolute -left-6 top-[18px] hidden h-[140px] w-[170px] md:block"
        style={{ backgroundImage: 'radial-gradient(#ebc3a4 1.6px, transparent 1.6px)', backgroundSize: '20px 20px' }}
      />
      <div className="absolute -right-9 top-[150px] h-[110px] w-[110px] rounded-full bg-[#ffd166] md:-right-7 md:top-[430px] md:h-[124px] md:w-[124px]" />

      <div className="absolute left-0 top-[50px] w-[88%] max-w-[318px] -rotate-2 overflow-hidden rounded-2xl bg-white shadow-[0_30px_60px_rgba(27,31,59,0.2)] md:top-[70px] md:w-[470px] md:max-w-none md:rounded-[20px] md:shadow-[0_36px_80px_rgba(27,31,59,0.22)]">
        <div className="flex items-center gap-1.5 bg-[#f6f0e9] px-[11px] py-[9px] md:gap-2 md:px-3.5 md:py-3">
          <span className="h-2 w-2 rounded-full bg-[#ff8a6b] md:h-2.5 md:w-2.5" />
          <span className="h-2 w-2 rounded-full bg-[#ffd166] md:h-2.5 md:w-2.5" />
          <span className="h-2 w-2 rounded-full bg-[#7cdb9e] md:h-2.5 md:w-2.5" />
          <span className="ml-2 flex h-5 grow items-center rounded-md bg-white px-2 text-[11px] font-semibold text-[#62667f] md:ml-2.5 md:h-6 md:rounded-lg md:px-2.5 md:text-xs">
            globalsolar.kz
          </span>
        </div>
        <Image
          src="/portfolio/global-solar.webp"
          alt={t('landing.hero.shotAlt')}
          width={1024}
          height={675}
          priority
          sizes="(min-width: 768px) 470px, 318px"
          className="block h-[188px] w-full object-cover object-top md:h-[300px]"
        />
      </div>

      <div className="absolute right-1 top-[142px] hidden w-[236px] rotate-3 rounded-[36px] bg-[#14161f] p-[9px] shadow-[0_36px_80px_rgba(27,31,59,0.3)] md:block">
        <div className="overflow-hidden rounded-[28px] bg-[#efe7de]">
          <div className="flex items-center gap-2.5 bg-[#0b6b5f] px-3.5 pb-3 pt-3.5 text-white">
            <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-[#ffd166] text-xs font-bold text-[#5c4200]">
              {t('landing.hero.chat.avatar')}
            </span>
            <span className="flex flex-col">
              <span className="text-[13px] font-bold">{t('landing.hero.chat.title')}</span>
              <span className="text-[11px] opacity-85">{t('landing.hero.chat.status')}</span>
            </span>
          </div>
          <div className="flex flex-col gap-2 px-2.5 pb-4 pt-3 text-xs leading-[1.4] text-[#1b1f3b]">
            {chat.map((message, index) => (
              <div
                key={index}
                className={
                  message.out
                    ? 'max-w-[82%] self-end rounded-[14px_14px_4px_14px] bg-[#d9fdd3] px-2.5 py-2'
                    : 'max-w-[86%] self-start rounded-[14px_14px_14px_4px] bg-white px-2.5 py-2'
                }
              >
                {message.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-0 flex w-[232px] max-w-[72%] items-start gap-2.5 rounded-2xl bg-white px-3 py-[11px] shadow-[0_18px_40px_rgba(27,31,59,0.14)] md:top-1 md:w-[300px] md:max-w-none md:gap-3 md:rounded-[18px] md:px-4 md:py-3.5 md:shadow-[0_18px_44px_rgba(27,31,59,0.14)]">
        <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[10px] bg-[#ddf7e7] text-[#0e7a3a] md:h-10 md:w-10 md:rounded-xl">
          <Check className="h-[18px] w-[18px] md:h-[22px] md:w-[22px]" />
        </span>
        <span className="flex flex-col gap-0.5 md:gap-[3px]">
          <span className="text-[13px] font-bold text-[#1b1f3b] md:text-sm">{t('landing.hero.toast.title')}</span>
          <span className="text-xs font-medium leading-[1.4] text-[#464a66] md:hidden">{t('landing.hero.toast.short')}</span>
          <span className="hidden text-[13px] font-medium leading-[1.4] text-[#464a66] md:block">{t('landing.hero.toast.text')}</span>
        </span>
      </div>

      <div className="absolute bottom-0 right-1.5 w-[204px] max-w-[60%] rounded-2xl bg-[#1b1f3b] px-3.5 py-[13px] text-white shadow-[0_18px_36px_rgba(27,31,59,0.28)] md:bottom-1.5 md:left-[22px] md:right-auto md:w-[300px] md:max-w-none md:rounded-[20px] md:px-5 md:py-[18px] md:shadow-[0_18px_44px_rgba(27,31,59,0.28)]">
        <div className="hidden font-serif text-[40px] leading-[0.6] text-[#ffd166] md:block">“</div>
        <div className="text-xs font-semibold leading-[1.45] md:mt-1 md:text-sm">
          «…поток клиентов увеличился в 30% только за первый месяц»
        </div>
        <div className="mt-1.5 text-xs font-semibold text-[#c3c6dd] md:mt-2">{t('landing.hero.quote.caption')}</div>
      </div>
    </div>
  );
}

export default function HomeHero({ lang }: { lang: Language }) {
  const t = getT(lang);
  const whatsappUrl = buildWhatsAppUrl(t('home.hero.message'), { sourcePath: `/${lang}` });

  return (
    <section className="hero-bg relative overflow-hidden">
      <div
        className={`${container} relative grid items-center gap-10 pb-[84px] pt-[calc(4rem+14px)] md:gap-14 lg:grid-cols-2 lg:pb-[120px] lg:pt-[calc(5rem+40px)]`}
      >
        <div className="flex flex-col gap-[18px] lg:gap-[26px]">
          <p className="inline-flex items-center gap-2 self-start rounded-full bg-white py-[7px] pl-2.5 pr-[13px] text-[13px] font-semibold text-[#1b1f3b] shadow-[0_4px_14px_rgba(27,31,59,0.08)] lg:gap-2.5 lg:py-2 lg:pl-3 lg:pr-4 lg:text-sm">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#25d366] shadow-[0_0_0_4px_#ddf7e7] lg:h-[9px] lg:w-[9px]" />
            {t('landing.hero.pill')}
          </p>
          <h1 className="text-[34px] leading-[1.07] tracking-[-0.035em] text-[#1b1f3b] sm:text-[44px] lg:text-[clamp(40px,4.2vw,60px)] lg:leading-[1.05]">
            {rich(t('landing.hero.title'))}
          </h1>
          <p className="max-w-[540px] text-base leading-[1.6] text-[#464a66] lg:text-[19px]">{t('landing.hero.text')}</p>
          <div className="mt-1.5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <TrackedLink
              href={whatsappUrl}
              external
              event={{ type: 'whatsapp', source: 'home_hero' }}
              className="flex h-14 items-center justify-center gap-2.5 rounded-[14px] bg-[#25d366] px-7 text-[17px] font-bold text-[#0b3d1f] shadow-[0_12px_26px_rgba(37,211,102,0.3)] transition-colors hover:bg-[#1fb356] lg:h-[60px] lg:px-6"
            >
              <WhatsAppGlyph className="h-[22px] w-[22px]" />
              {t('home.bar.cta')}
            </TrackedLink>
            <TrackedLink
              href="#contact"
              event={{ type: 'calculate', source: 'home_hero' }}
              className="flex h-14 items-center justify-center gap-2.5 rounded-[14px] bg-[#b4232c] px-7 text-[17px] font-bold text-white transition-colors hover:bg-[#8f1b23] lg:h-[60px] lg:px-6"
            >
              {t('landing.hero.estimate')}
              <ArrowRight className="h-5 w-5" />
            </TrackedLink>
          </div>
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
                event={{ type: 'external', label: '2gis_hero' }}
                className="text-[13px] font-semibold text-[#464a66] underline decoration-[#e5c7ae] underline-offset-4 hover:text-[#b4232c] lg:text-sm"
              >
                {t('landing.hero.rating')}
              </TrackedLink>
            </div>
          </div>
        </div>

        <HeroVisual lang={lang} />
      </div>
    </section>
  );
}
