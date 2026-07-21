import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['ru', 'en', 'kz'];
const defaultLocale = 'ru';
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
  let locale = defaultLocale;

  const localePrefix = `/${locale}`;
  const redirectToLocale = (targetPath: string) => {
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = targetPath;
    return NextResponse.redirect(newUrl, 301);
  };

  if (pathname === '/') {
    return redirectToLocale(localePrefix);
  }

  const localelessPrefixes = ['/pricing', '/services', '/blog', '/cities'];
  if (localelessPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return redirectToLocale(`${localePrefix}${pathname}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
};



