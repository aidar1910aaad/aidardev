import { fitTitle, MAX_TITLE_LENGTH } from '../title';

describe('fitTitle', () => {
  it('keeps the brand suffix when the full title fits', () => {
    expect(fitTitle('Создать сайт под ключ — цены в Алматы и Астане')).toBe('Создать сайт под ключ — цены в Алматы и Астане');
  });

  it('drops the brand suffix when it would push the title past the limit', () => {
    const title = 'Разработка мобильных приложений в Астане | iOS и Android под ключ';
    expect(fitTitle(title)).toEqual({ absolute: title });
  });

  it('keeps the brand on a title that ends exactly at the limit', () => {
    const title = 'x'.repeat(MAX_TITLE_LENGTH - ' | aidardev'.length);
    expect(fitTitle(title)).toBe(title);
    expect(fitTitle(title + 'x')).toEqual({ absolute: title + 'x' });
  });
});
