import { notFound } from 'next/navigation';

const languages = ['ru', 'en', 'kz'];

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
