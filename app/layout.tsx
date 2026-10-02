import type { Metadata } from "next";
import { Geologica, Onest } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import GoogleAnalytics from "./components/SEO/GoogleAnalytics";
import YandexMetrika from "./components/SEO/YandexMetrika";
import MicrosoftClarity from "./components/SEO/MicrosoftClarity";

// Заголовки — Geologica, текст — Onest: обе с казахскими буквами (в cyrillic-ext).
// Переменные шрифты: один файл на все начертания. Предзагружаем latin и cyrillic, cyrillic-ext грузится по запросу.
const geologica = Geologica({
  variable: "--font-geologica",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';
// Бренд в шаблоне title и og:site_name — коротко «aidardev»; полное название — заголовок по умолчанию.
const siteName = 'aidardev';
const defaultTitle = 'aidardev — Development Studio';
const defaultDescription = {
  en: 'aidardev is a development studio building websites, e-commerce, Telegram bots and AI solutions in Almaty, Astana, Shymkent and throughout Kazakhstan. 6+ years experience, 38+ projects.',
  ru: 'aidardev — студия разработки сайтов, интернет-магазинов, Telegram-ботов и AI-решений в Алматы, Астане, Шымкенте и по всему Казахстану. 6+ лет опыта, 38+ проектов.',
  kz: 'aidardev — Алматы, Астана, Шымкент және бүкіл Қазақстан бойынша сайттар, интернет-дүкендер, Telegram-боттар және AI шешімдерін жасайтын әзірлеу студиясы. 6+ жыл тәжірибе, 38+ жоба.',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription.ru,
  keywords: [
    // Основные услуги
    'веб-разработка',
    'full-stack developer',
    'разработка сайтов',
    'создание сайтов',
    'разработка интернет-магазинов',
    'корпоративные сайты',
    'лендинги',
    'чат-боты',
    'telegram бот',
    'whatsapp бот',
    'ai чатбот',
    'ии интеграции',
    'мобильные приложения',
    'ios приложение',
    'android приложение',
    'ui ux дизайн',
    'веб-дизайн',
    'редизайн сайтов',
    // Технологии
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Python',
    'AI',
    'GPT',
    'машинное обучение',
    // География - Казахстан
    'Казахстан',
    'Kazakhstan',
    'разработка сайтов казахстан',
    'веб разработка казахстан',
    'full stack разработчик казахстан',
    // География - города
    'Алматы',
    'Алма-Ата',
    'разработка сайтов алматы',
    'Астана',
    'Нур-Султан',
    'разработка сайтов астана',
    'Шымкент',
    'разработка сайтов шымкент',
    'Актобе',
    'Караганда',
    'Тараз',
    'Павлодар',
    'Усть-Каменогорск',
    'Атырау',
    'Семей',
    'Кызылорда',
    'Костанай',
    'Актау',
    'Уральск',
    // Английские варианты
    'web development',
    'frontend',
    'backend',
    'Telegram bot',
    'WhatsApp bot',
    'mobile app development',
  ],
  authors: [{ name: 'Aidar', url: siteUrl }],
  creator: 'Aidar',
  publisher: 'aidardev',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    alternateLocale: ['en_US', 'kk_KZ'],
    url: siteUrl,
    siteName: siteName,
    title: defaultTitle,
    description: defaultDescription.ru,
    // Картинки превью — файлы opengraph-image.tsx у каждой страницы (app/lib/og-image.tsx).
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription.ru,
    creator: '@aidardev',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: `${siteUrl}/ru`,
    languages: {
      'ru': `${siteUrl}/ru`,
      'en': `${siteUrl}/en`,
      'kk': `${siteUrl}/kz`, // kk - стандартный код казахского языка ISO 639-1
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
  category: 'technology',
  classification: 'Portfolio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Yandex Verification */}
        {process.env.NEXT_PUBLIC_YANDEX_VERIFICATION && (
          <meta name="yandex-verification" content={process.env.NEXT_PUBLIC_YANDEX_VERIFICATION} />
        )}
        
        {/* Шрифты отдаём сами (next/font), к Google Fonts браузер не ходит */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://clarity.microsoft.com" />
        
        {/* Light theme only */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geologica.variable} ${onest.variable} bg-white antialiased`}
      >
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <Analytics />
            <SpeedInsights />
            <GoogleAnalytics />
            <YandexMetrika />
            <MicrosoftClarity />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
