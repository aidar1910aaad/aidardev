'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from './contexts/LanguageContext';
import Header from './components/landing/EditorialHeader';
import Footer from './components/landing/Footer';

export default function NotFound() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-orange-50/20 dark:from-gray-950 dark:via-blue-950/10 dark:to-orange-950/10">
      <Header />
      
      <main className="relative min-h-[calc(100vh-200px)] flex items-center justify-center overflow-hidden pt-20">
        {/* Анимированный фон */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/40 to-orange-50/40 dark:from-gray-950 dark:via-blue-950/30 dark:to-orange-950/30">
          {/* Плавающие градиентные орбы */}
          <div 
            className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-blob"
            style={{ willChange: 'transform', transform: 'translateZ(0)' }}
          ></div>
          <div 
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/20 dark:bg-orange-500/10 rounded-full blur-3xl animate-blob" 
            style={{ animationDelay: '2s', willChange: 'transform', transform: 'translateZ(0)' }}
          ></div>
          <div 
            className="absolute top-1/2 right-1/3 w-72 h-72 bg-cyan-500/15 dark:bg-cyan-500/8 rounded-full blur-3xl animate-blob" 
            style={{ animationDelay: '4s', willChange: 'transform', transform: 'translateZ(0)' }}
          ></div>
        </div>

        {/* Сетка паттерн */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-20"
          style={{ willChange: 'auto' }}
        ></div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* 404 Number */}
            <div 
              className="mb-8"
              style={{ 
                animation: 'fadeInUp 0.6s ease-out',
                transform: 'translateZ(0)'
              }}
            >
              <h1 className="text-9xl sm:text-[12rem] md:text-[16rem] font-light tracking-wider mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-600 to-orange-600 dark:from-blue-400 dark:via-cyan-400 dark:to-orange-400 inline-block">
                  404
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <div
              className="mb-6"
              style={{ 
                animation: 'fadeInUp 0.6s ease-out 0.1s both',
                transform: 'translateZ(0)',
                willChange: 'transform, opacity'
              }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-4 tracking-wide">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-900 to-orange-900 dark:from-white dark:via-blue-300 dark:to-orange-300">
                  {t('not-found.subtitle')}
                </span>
              </h2>
            </div>

            {/* Description */}
            <div
              className="mb-12"
              style={{ 
                animation: 'fadeInUp 0.6s ease-out 0.2s both',
                transform: 'translateZ(0)',
                willChange: 'transform, opacity'
              }}
            >
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
                {t('not-found.description')}
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              style={{ 
                animation: 'fadeInUp 0.6s ease-out 0.3s both',
                transform: 'translateZ(0)',
                willChange: 'transform, opacity'
              }}
            >
              <Link
                href={`/${language}`}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-orange-600 dark:from-blue-500 dark:to-orange-500 text-white rounded-xl font-light tracking-wide shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 dark:hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {t('not-found.backHome')}
                  <svg 
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-orange-700 dark:from-blue-600 dark:to-orange-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              <Link
                href={`/${language}/services`}
                className="group px-8 py-4 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-light tracking-wide hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center justify-center gap-2">
                  {t('not-found.explore')}
                  <svg 
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Decorative line */}
            <div
              className="mt-16"
              style={{ 
                animation: 'fadeInUp 0.6s ease-out 0.4s both',
                transform: 'translateZ(0)',
                willChange: 'transform, opacity'
              }}
            >
              <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-orange-600 mx-auto rounded-full"></div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}



