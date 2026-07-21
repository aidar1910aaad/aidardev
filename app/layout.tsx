import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import GoogleAnalytics from "./components/SEO/GoogleAnalytics";
import YandexMetrika from "./components/SEO/YandexMetrika";
import MicrosoftClarity from "./components/SEO/MicrosoftClarity";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  adjustFontFallback: false,
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700"],
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';
const siteName = 'aidardev — Development Studio';
const defaultDescription = {
  en: 'aidardev is a development studio building websites, e-commerce, Telegram bots and AI solutions in Almaty, Astana, Shymkent and throughout Kazakhstan. 6+ years experience, 47+ projects.',
  ru: 'aidardev — студия разработки сайтов, интернет-магазинов, Telegram-ботов и AI-решений в Алматы, Астане, Шымкенте и по всему Казахстану. 6+ лет опыта, 47+ проектов.',
  kz: 'aidardev — Алматы, Астана, Шымкент және бүкіл Қазақстан бойынша сайттар, интернет-дүкендер, Telegram-боттар және AI шешімдерін жасайтын әзірлеу студиясы. 6+ жыл тәжірибе, 47+ жоба.',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
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
  publisher: 'Aidar',
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
    title: siteName,
    description: defaultDescription.ru,
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
          alt: 'aidardev — Development Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: defaultDescription.ru,
    images: ['/og-image.svg'],
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
        
        {/* Preconnect для быстрой загрузки внешних ресурсов */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
        className={`${manrope.variable} ${outfit.variable} bg-[#f4f2ec] antialiased`}
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
