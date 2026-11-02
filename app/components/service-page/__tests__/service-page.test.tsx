import { render } from '@testing-library/react';
import { servicePage } from '../../../contexts/translations/service-page';
import { getT } from '../../home/shared';
import { formatPrice, minPrice, parseBullets, parseSteps, priceFrom, SERVICE_KEYS, TypeIcon } from '../meta';
import { serviceFaqItems } from '../ServiceFaqSection';

const languages = ['ru', 'en', 'kz'] as const;

describe('service pages', () => {
  it('has every service page label in all three languages', () => {
    const ruKeys = Object.keys(servicePage.ru).sort();
    expect(Object.keys(servicePage.en).sort()).toEqual(ruKeys);
    expect(Object.keys(servicePage.kz).sort()).toEqual(ruKeys);
  });

  it('splits the process text into numbered steps without changing the words', () => {
    const parsed = parseSteps('Как проходит разработка сайта:\n\n1. Бриф и разбор задачи\n2. Структура и прототип\n3. Запуск');
    expect(parsed).toEqual({ title: 'Как проходит разработка сайта', steps: ['Бриф и разбор задачи', 'Структура и прототип', 'Запуск'], rest: [] });
    expect(parseSteps('Просто абзац текста без шагов')).toBeNull();
  });

  it('splits the examples text into a list', () => {
    expect(parseBullets('Примеры ботов:\n\n- Бот записи\n- WhatsApp-бот первой линии')).toEqual({
      title: 'Примеры ботов',
      items: ['Бот записи', 'WhatsApp-бот первой линии'],
      rest: [],
    });
  });

  it('parses the real process and examples of every service in every language', () => {
    for (const lang of languages) {
      const t = getT(lang);
      for (const service of SERVICE_KEYS) {
        expect([lang, service, (parseSteps(t(`services.${service}.process`))?.steps.length ?? 0) >= 3]).toEqual([lang, service, true]);
        expect([lang, service, parseBullets(t(`services.${service}.examples`)).items.length >= 2]).toEqual([lang, service, true]);
        expect([lang, service, serviceFaqItems(lang, `services.${service}.faq`).length >= 5]).toEqual([lang, service, true]);
      }
    }
  });

  it('formats «from» prices per language from pricing.json', () => {
    expect(minPrice('websites')).toBe(45000);
    expect(priceFrom(150000, 'ru', getT('ru'))).toBe('от 150 000 ₸');
    expect(priceFrom(150000, 'en', getT('en'))).toBe('from 150,000 ₸');
    expect(priceFrom(15000, 'kz', getT('kz'), true)).toBe('15 000 ₸-ден / сағат');
    expect(formatPrice(1500000, 'ru')).toBe('1 500 000');
  });

  it('picks card icons by word start, not by any substring', () => {
    const path = (title: string) => render(<TypeIcon title={title} />).container.querySelector('path')?.getAttribute('d');
    // «бот» внутри «разработки» и «ai» внутри «maintenance» не должны давать иконку бота и ИИ
    expect(path('Разработка лендингов')).toBe(path('Лендинги и сайты-визитки'));
    expect(path('Technical Support and Maintenance')).toBe(path('Техническая поддержка'));
    expect(path('Telegram-боты')).not.toBe(path('Лендинги'));
  });
});
