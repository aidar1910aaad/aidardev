import { render } from '@testing-library/react';
import { landing } from '../../../contexts/translations/landing';
import { homeFaqItems } from '../HomeFaq';
import { plain, rich } from '../shared';

const languages = ['ru', 'en', 'kz'] as const;

describe('home page content', () => {
  it('has every landing text in all three languages', () => {
    const ruKeys = Object.keys(landing.ru).sort();
    // The reviews note is shown only on the EN/KZ pages: reviews are quoted in the original Russian.
    const expected = (lang: string) => (lang === 'ru' ? ruKeys : [...ruKeys, 'landing.reviews.note'].sort());
    for (const lang of ['en', 'kz'] as const) {
      expect(Object.keys(landing[lang]).sort()).toEqual(expected(lang));
    }
    for (const lang of languages) {
      for (const [key, value] of Object.entries(landing[lang] as Record<string, string>)) {
        expect([key, value.trim().length > 0]).toEqual([key, true]);
      }
    }
  });

  it('finds every FAQ question and answer in each language', () => {
    for (const lang of languages) {
      const items = homeFaqItems(lang);
      expect(items).toHaveLength(12);
      for (const item of items) {
        expect(item.question).not.toMatch(/^faq\./);
        expect(item.answer).not.toMatch(/^faq\./);
      }
    }
  });

  it('renders [no-wrap] and {highlight} markup from translations', () => {
    const { container } = render(<h1>{rich('Сайты и [WhatsApp-боты,] которые приносят бизнесу {заявки}')}</h1>);
    const spans = container.querySelectorAll('span');
    expect(container.textContent).toBe('Сайты и WhatsApp-боты, которые приносят бизнесу заявки');
    expect(spans).toHaveLength(2);
    expect(spans[0].className).toBe('whitespace-nowrap');
    expect(spans[1].className).toContain('shadow-');
    expect(plain('Интернет-магазин с [Kaspi Pay]')).toBe('Интернет-магазин с Kaspi Pay');
  });
});
