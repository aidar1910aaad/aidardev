import { cityPage } from '../../../contexts/translations/city-page';
import { cityEntries, getCityBySlug, getCityLandingContent } from '../../../data/cities';
import { cityServiceCombos, getCityServiceContent } from '../../../data/city-services';

const languages = ['ru', 'en', 'kz'] as const;
const city = (slug: string) => {
  const entry = getCityBySlug(slug);
  if (!entry) throw new Error(`Unknown city ${slug}`);
  return entry;
};

describe('city pages', () => {
  it('has every city page label in all three languages', () => {
    const ruKeys = Object.keys(cityPage.ru).sort();
    expect(Object.keys(cityPage.en).sort()).toEqual(ruKeys);
    expect(Object.keys(cityPage.kz).sort()).toEqual(ruKeys);
  });

  it('gives Astana extra answers for its long-tail queries, in Russian only', () => {
    const astanaRu = getCityLandingContent(city('astana'), 'ru').faq.map((item) => item.question);
    expect(astanaRu).toEqual(expect.arrayContaining(['Сопровождаете сайт после запуска?', 'Как вы отвечаете за качество сайта?']));
    expect(astanaRu.length).toBe(getCityLandingContent(city('almaty'), 'ru').faq.length + 5);
    expect(getCityLandingContent(city('astana'), 'kz').faq.length).toBe(getCityLandingContent(city('almaty'), 'kz').faq.length);
  });

  it('builds the texts of every city and city service page', () => {
    for (const lang of languages) {
      for (const entry of cityEntries) {
        const content = getCityLandingContent(entry, lang);
        expect([entry.slug, lang, content.h1.length > 0, content.highlights.length, content.faq.length >= 2]).toEqual([
          entry.slug,
          lang,
          true,
          3,
          true,
        ]);
      }
      for (const combo of cityServiceCombos) {
        expect([combo.citySlug, lang, Boolean(getCityServiceContent(city(combo.citySlug), combo.service, lang)?.h1)]).toEqual([
          combo.citySlug,
          lang,
          true,
        ]);
      }
    }
  });
});
