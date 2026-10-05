import { notFound } from 'next/navigation';

const languages = ['ru', 'en', 'kz'];

/**
 * Главная, услуги, цены и остальные страницы трёх языков собираются при сборке и отдаются из кэша Vercel.
 * Без этого каждая открывалась рендером на сервере: «остывшая» функция отвечала 2–4 с.
 */
export function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

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
  if (!languages.includes(lang)) notFound();
  // Обёртка без своей рамки (display: contents) — только задаёт палитру сайта для потомков
  return <div className="brand-site contents">{children}</div>;
}
