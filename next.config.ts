import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SEO оптимизации
  compress: true,
  poweredByHeader: false, // Убираем X-Powered-By для безопасности
  
  // Оптимизация изображений
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
    qualities: [70, 75, 85],
  },

  // Экспериментальные оптимизации для производительности
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  
  // Оптимизация production сборки
  productionBrowserSourceMaps: false,

  // Headers для SEO и безопасности
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // HSTS - принудительное использование HTTPS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },

  // Redirects для SEO
  async redirects() {
    return [
      // Старые страницы кейсов (404 в GSC) → главная с портфолио
      // slug без точки — не трогаем статику /projects/*.jpg|png
      {
        source: '/projects/:slug([^/.]+)',
        destination: '/ru',
        permanent: true,
      },
      {
        source: '/:lang(ru|en|kz)/projects/:slug([^/.]+)',
        destination: '/:lang',
        permanent: true,
      },
      {
        source: '/projects',
        destination: '/ru',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
