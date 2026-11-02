import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { defaultLocale, locales } from './app/lib/i18n';

const canonicalHost = 'www.aidardev.kz';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';

  // Редирект без www → www
  if (host === 'aidardev.kz') {
    const url = request.nextUrl.clone();
    url.host = canonicalHost;
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  // 1. ПРИНУДИТЕЛЬНЫЙ РЕДИРЕКТ HTTP → HTTPS
  // Проверяем протокол через заголовки (для Vercel, Railway и других прокси)
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const forwardedSsl = request.headers.get('x-forwarded-ssl');
  const urlProtocol = request.nextUrl.protocol;
  
  // Определяем, используется ли HTTPS
  const isHttps = forwardedProto === 'https' || 
                  forwardedSsl === 'on' || 
                  urlProtocol === 'https:';
  
  // В production принудительно редиректим на HTTPS
  if (process.env.NODE_ENV === 'production' && !isHttps) {
    const httpsUrl = request.nextUrl.clone();
    httpsUrl.protocol = 'https:';
    // Сохраняем порт, если он не стандартный
    if (request.nextUrl.port && request.nextUrl.port !== '80' && request.nextUrl.port !== '443') {
      httpsUrl.port = request.nextUrl.port;
    } else {
      httpsUrl.port = '';
    }
    return NextResponse.redirect(httpsUrl, 301); // 301 - постоянный редирект
  }

  // 2. Обработка языков
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Если язык уже в URL, пропускаем
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Всегда используем дефолтный язык (ru) для новых посетителей
  const locale = defaultLocale;

  const localePrefix = `/${locale}`;
  const redirectToLocale = (targetPath: string) => {
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = targetPath;
    return NextResponse.redirect(newUrl, 301);
  };

  if (pathname === '/') {
    return redirectToLocale(localePrefix);
  }

  const localelessPrefixes = ['/pricing', '/services', '/blog', '/cities', '/privacy', '/solutions'];
  if (localelessPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return redirectToLocale(`${localePrefix}${pathname}`);
  }

  return NextResponse.next();
}

/**
 * Proxy запускается только там, где возможен редирект: каждый вызов — это Fluid CPU на Vercel.
 * Страницы с языком (/ru/...), RSC/prefetch, OG-картинки, sitemap, robots, RSS, /api и статика
 * на www.aidardev.kz его не вызывают. Значения matcher должны быть литералами (статический разбор при сборке).
 */
export const config = {
  matcher: [
    // Хост без www → www. Как и раньше, кроме /api (вебхук бэкенда шлёт POST на aidardev.kz), статики Next и картинок.
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
      has: [{ type: 'host', value: 'aidardev\\.kz' }],
    },
    // HTTP → HTTPS за прокси, который передаёт x-forwarded-proto: http (на Vercel запросы уже приходят по https).
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
      has: [{ type: 'header', key: 'x-forwarded-proto', value: 'http' }],
    },
    // Корень → /ru.
    '/',
    // Разделы без языка (/pricing, /services/..., /blog/..., /cities/..., /privacy, /solutions/...) → /ru/... Картинки не трогаем.
    '/((?!.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico))(?:pricing|services|blog|cities|privacy|solutions)(?:/.*)?)',
  ],
};



