import {
  buildWhatsAppUrl,
  installWhatsAppSourceTracking,
  langFromPath,
  PRIMARY_WHATSAPP_NUMBER,
  toSourcePath,
  withSourceMarker,
  withWhatsAppSource,
} from '../whatsapp';

const textOf = (url: string) => new URL(url).searchParams.get('text');

describe('withSourceMarker', () => {
  it('appends a marker localized by the path language', () => {
    expect(withSourceMarker('Здравствуйте!', '/ru/services/bots')).toBe('Здравствуйте!\n\n(с сайта: /ru/services/bots)');
    expect(withSourceMarker('Сәлеметсіз бе!', '/kz/pricing')).toBe('Сәлеметсіз бе!\n\n(сайттан: /kz/pricing)');
    expect(withSourceMarker('Hi!', '/en')).toBe('Hi!\n\n(from site: /en)');
  });

  it('uses the path only: no origin, query or hash', () => {
    expect(toSourcePath('https://www.aidardev.kz/ru/services/bots?utm_source=google#contact')).toBe('/ru/services/bots');
    expect(withSourceMarker('Hi', '/ru/pricing?utm_source=ya&yclid=1#contact')).toBe('Hi\n\n(с сайта: /ru/pricing)');
  });

  it('replaces an existing marker instead of stacking them', () => {
    const marked = withSourceMarker('Hi', '/ru');
    expect(withSourceMarker(marked, '/ru')).toBe(marked);
    expect(withSourceMarker(marked, '/kz/pricing')).toBe('Hi\n\n(сайттан: /kz/pricing)');
  });

  it('returns the trimmed text without a path, and nothing for an empty text', () => {
    expect(withSourceMarker('  Hi  ', null)).toBe('Hi');
    expect(withSourceMarker('  Hi  ', '')).toBe('Hi');
    expect(withSourceMarker('   ', '/ru')).toBe('');
  });

  it('falls back to Russian outside the language prefixes', () => {
    expect(langFromPath('/')).toBe('ru');
    expect(langFromPath('/kz')).toBe('kz');
    expect(langFromPath('/en/blog/post')).toBe('en');
    expect(langFromPath('/kzx/page')).toBe('ru');
  });
});

describe('buildWhatsAppUrl with sourcePath', () => {
  it('adds the marker at link-build time', () => {
    const url = buildWhatsAppUrl('Здравствуйте! Хочу обсудить проект.', { sourcePath: '/ru/services/bots' });
    expect(url.startsWith(`https://wa.me/${PRIMARY_WHATSAPP_NUMBER}?text=`)).toBe(true);
    expect(textOf(url)).toBe('Здравствуйте! Хочу обсудить проект.\n\n(с сайта: /ru/services/bots)');
  });

  it('accepts the phone in options as well as in the legacy argument', () => {
    expect(buildWhatsAppUrl('Hello', { phone: '+7 (706) 670-36-96' })).toBe('https://wa.me/77066703696?text=Hello');
    expect(buildWhatsAppUrl('Hello', '+7 (706) 670-36-96')).toBe('https://wa.me/77066703696?text=Hello');
  });

  it('does not prefill a bare marker', () => {
    expect(buildWhatsAppUrl('  ', { sourcePath: '/ru' })).toBe(`https://wa.me/${PRIMARY_WHATSAPP_NUMBER}`);
  });
});

describe('withWhatsAppSource (links built without a path)', () => {
  it('stamps the text of a wa.me link and keeps %20 encoding', () => {
    const decorated = withWhatsAppSource(buildWhatsAppUrl('Hi there'), '/kz/services/ai');
    expect(textOf(decorated)).toBe('Hi there\n\n(сайттан: /kz/services/ai)');
    expect(decorated).toContain('Hi%20there');
  });

  it('is a no-op for links that already carry the same marker', () => {
    const built = buildWhatsAppUrl('Hi', { sourcePath: '/ru/pricing' });
    expect(withWhatsAppSource(built, '/ru/pricing')).toBe(built);
  });

  it('ignores other links and WhatsApp links without a text', () => {
    expect(withWhatsAppSource('https://t.me/opunksnoo', '/ru')).toBe('https://t.me/opunksnoo');
    expect(withWhatsAppSource('https://wa.me/77066703696', '/ru')).toBe('https://wa.me/77066703696');
    expect(withWhatsAppSource('/ru/pricing', '/ru')).toBe('/ru/pricing');
  });

  it('keeps the other parameters of api.whatsapp.com links', () => {
    const url = new URL(withWhatsAppSource('https://api.whatsapp.com/send?phone=77066703696&text=Hi', '/ru'));
    expect(url.searchParams.get('phone')).toBe('77066703696');
    expect(url.searchParams.get('text')).toBe('Hi\n\n(с сайта: /ru)');
  });
});

describe('installWhatsAppSourceTracking', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    window.history.pushState({}, '', '/');
  });

  it('stamps WhatsApp links with the current page right before they open', () => {
    window.history.pushState({}, '', '/ru/services/bots?utm_source=google');
    document.body.innerHTML = `
      <a id="wa" href="${buildWhatsAppUrl('Hi')}"><span id="wa-label">WhatsApp</span></a>
      <a id="tg" href="https://t.me/opunksnoo">Telegram</a>`;
    // jsdom cannot navigate; the tracking listener runs in the capture phase before this one.
    const stopNavigation = (event: Event) => event.preventDefault();
    document.addEventListener('click', stopNavigation);
    const release = installWhatsAppSourceTracking();
    const releaseAgain = installWhatsAppSourceTracking();

    document.getElementById('wa-label')!.click();
    expect(textOf(document.getElementById('wa')!.getAttribute('href')!)).toBe('Hi\n\n(с сайта: /ru/services/bots)');
    document.getElementById('tg')!.click();
    expect(document.getElementById('tg')!.getAttribute('href')).toBe('https://t.me/opunksnoo');

    release();
    release();
    document.getElementById('wa')!.setAttribute('href', buildWhatsAppUrl('Still tracked'));
    document.getElementById('wa-label')!.click();
    expect(textOf(document.getElementById('wa')!.getAttribute('href')!)).toBe('Still tracked\n\n(с сайта: /ru/services/bots)');

    releaseAgain();
    document.getElementById('wa')!.setAttribute('href', buildWhatsAppUrl('Not tracked'));
    document.getElementById('wa-label')!.click();
    expect(textOf(document.getElementById('wa')!.getAttribute('href')!)).toBe('Not tracked');

    document.removeEventListener('click', stopNavigation);
  });
});
