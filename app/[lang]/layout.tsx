import { notFound } from 'next/navigation';
import { isLocale, localeParams } from '../lib/i18n';

/**
 * Главная, услуги, цены и остальные страницы трёх языков собираются при сборке и отдаются из кэша Vercel.
 * Без этого каждая открывалась рендером на сервере: «остывшая» функция отвечала 2–4 с.
 */
export function generateStaticParams() {
  return localeParams();
}

// dynamicParams = false здесь не ставим: настройка layout действует на все вложенные маршруты,
// и /[lang]/blog/[slug] перестал бы открывать новые статьи. Она задана в page.tsx каждой страницы
// с фиксированным набором параметров.

/**
 * Любой первый сегмент URL попадал в [lang] и открывал главную с кодом 200
 * (/wp-login.php, /foo) или падал с 500 (/foo/services/websites).
 * Неизвестный язык — честный 404.
 */
export default async function LanguageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  // Обёртка без своей рамки (display: contents) — только задаёт палитру сайта для потомков
  return <div className="brand-site contents">{children}</div>;
}
