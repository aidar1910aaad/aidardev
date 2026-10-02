// Общие части главной: перевод на сервере, разметка заголовков, контейнер и подписи разделов.
// Без хуков — используется в серверных компонентах.
import type { ReactNode } from 'react';
import { translations } from '../../contexts/translations';
import type { Language } from '../../contexts/LanguageContext';

export type T = (key: string) => string;

/** То же, что t() из LanguageContext, но на сервере: значение по ключу или сам ключ. */
export function getT(lang: Language): T {
  return (key) => translations[lang][key] || key;
}

/**
 * Текст с разметкой из переводов: [..] — без переноса строки, {..} — подсветка маркером.
 * Пример: «Сайты и [WhatsApp-боты,] которые приносят бизнесу {заявки}».
 */
export function rich(text: string, highlightClass = 'shadow-[inset_0_-0.3em_0_#ffd166]'): ReactNode[] {
  return text.split(/(\[[^\]]+\]|\{[^}]+\})/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('[')) {
      return (
        <span key={index} className="whitespace-nowrap">
          {part.slice(1, -1)}
        </span>
      );
    }
    if (part.startsWith('{')) {
      return (
        <span key={index} className={`whitespace-nowrap ${highlightClass}`}>
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
}

/** Убирает разметку [..] и {..} — для alt, aria-label и JSON-LD. */
export function plain(text: string): string {
  return text.replace(/[[\]{}]/g, '');
}

export const container = 'mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-10';
export const sectionY = 'py-16 lg:py-28';

export function Kicker({ children, tone = 'accent' }: { children: ReactNode; tone?: 'accent' | 'sun' | 'muted' }) {
  const color = tone === 'sun' ? 'text-[#ffd166]' : tone === 'muted' ? 'text-[#62667f]' : 'text-[#b4232c]';
  return <p className={`text-xs font-bold uppercase tracking-[0.08em] lg:text-[13px] ${color}`}>{children}</p>;
}

export function SectionTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`text-[30px] font-bold leading-[1.1] tracking-[-0.03em] sm:text-[36px] lg:text-[clamp(32px,3.2vw,46px)] lg:leading-[1.08] ${className}`}>
      {children}
    </h2>
  );
}
