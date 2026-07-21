'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../common/AnimatedSection';
import { analyticsEvents } from '../../lib/analytics';
import pricingData from '../../data/pricing.json';
import Contact from './ConversionContact';

interface PricingPackage {
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
}

type PricingSourcePackage = PricingPackage;

export default function Pricing() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('websites');
  const [introExpanded, setIntroExpanded] = useState<boolean>(false);

  const categories = [
    { 
      key: 'websites', 
      label: t('pricing.websites'), 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      key: 'bots', 
      label: t('pricing.bots'), 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )
    },
    { 
      key: 'ai', 
      label: t('pricing.ai'), 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    { 
      key: 'mobile', 
      label: t('pricing.mobile'), 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      key: 'design', 
      label: t('pricing.design'), 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      )
    },
    { 
      key: 'consulting', 
      label: t('pricing.consulting'), 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
  ];

  const getPackages = (): PricingPackage[] => {
    const categoryData = (pricingData.services as Record<string, Record<string, PricingSourcePackage>>)[selectedCategory];
    if (!categoryData) return [];
    
    // Переводим данные из pricing.json
    return Object.entries(categoryData).map(([key, pkg]) => {
      const translationKey = `pricing.packages.${selectedCategory}.${key}`;
      
      return {
        name: t(`${translationKey}.name`) || pkg.name,
        price: pkg.price,
        currency: pkg.currency,
        description: t(`${translationKey}.description`) || pkg.description,
        features: pkg.features.map((feature: string, index: number) => 
          t(`${translationKey}.features.${index}`) || feature
        ),
      };
    }) as PricingPackage[];
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const scrollToContact = () => {
    // Если мы на странице /pricing, скроллим к контактам на той же странице
    if (typeof window !== 'undefined' && window.location.pathname === '/pricing') {
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'auto' });
        analyticsEvents.scrollToSection('contact');
      }
    } else {
      // Если мы на главной странице, скроллим к контактам
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'auto' });
        analyticsEvents.scrollToSection('contact');
      }
    }
  };

  const scrollToChat = () => {
    if (typeof window === 'undefined') return;
    
    const pathname = window.location.pathname;
    
    // Определяем язык из URL
    let lang = 'ru';
    if (pathname.startsWith('/en')) {
      lang = 'en';
    } else if (pathname.startsWith('/kz')) {
      lang = 'kz';
    } else if (pathname.startsWith('/ru')) {
      lang = 'ru';
    }
    
    // Если мы на странице pricing (с любым языковым префиксом), переходим на главную с якорем
    if (pathname.includes('/pricing')) {
      window.location.href = `/${lang}#chat`;
      analyticsEvents.calculatePriceClick('Pricing Page');
    } else {
      // Если на главной странице, скроллим к чату
      const element = document.getElementById('chat');
      if (element) {
        element.scrollIntoView({ behavior: 'auto' });
        analyticsEvents.calculatePriceClick('Pricing Page');
      }
    }
  };

  const packages = getPackages();

  return (
    <section id="pricing" className="border-b border-slate-300 bg-[#f7f7f5] pt-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <AnimatedSection animationType="slide-up" delay={0}>
            <div className="grid gap-8 border-y border-slate-300 py-10 md:grid-cols-12 md:py-14">
              <div className="md:col-span-7">
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">Aidar / Pricing</p>
                <h1 className="text-5xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-6xl md:text-7xl">
                  {t('pricing.h1')}
                </h1>
              </div>
              <div className="self-end md:col-span-5">
                <p className="mb-3 text-xl leading-8 text-slate-800">
                  {t('pricing.subtitle')}
                </p>
                <p className="text-sm leading-6 text-slate-500">
                  {t('pricing.description')}
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Intro Text with Keywords - Expandable */}
          <AnimatedSection animationType="slide-up" delay={50}>
            <div className="mb-12 mt-10 max-w-4xl">
              <div className="border-l-2 border-blue-700 bg-white p-7">
                <div className="relative">
                  <div 
                    className="overflow-hidden transition-all duration-700 ease-in-out"
                    style={{
                      maxHeight: introExpanded ? '1000px' : '135px',
                    }}
                  >
                    <p className="text-lg leading-8 text-slate-700">
                      {t('pricing.intro')}
                    </p>
                  </div>
                  {/* Gradient fade-out effect when collapsed */}
                  {!introExpanded && (
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 border-b border-slate-200 bg-white/90"></div>
                  )}
                </div>
                {!introExpanded && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setIntroExpanded(true)}
                      className="flex items-center gap-2 text-sm font-medium text-blue-700 transition-colors hover:text-blue-900"
                    >
                      <span>{t('pricing.readMore')}</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
                {introExpanded && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setIntroExpanded(false)}
                      className="flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900"
                    >
                      <span>{t('pricing.hide')}</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>

          {/* Category Selector */}
          <AnimatedSection animationType="slide-up" delay={100}>
            <div className="mb-12 flex flex-wrap border-l border-t border-slate-300">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`flex items-center gap-2 border-b border-r border-slate-300 px-5 py-3 text-sm font-medium transition-colors ${
                    selectedCategory === category.key
                      ? 'bg-blue-700 text-white'
                      : 'bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  <span className={selectedCategory === category.key ? 'text-white' : 'text-blue-700'}>
                    {category.icon}
                  </span>
                  {category.label}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Pricing Cards */}
          <div className="mb-12 grid grid-cols-1 border-l border-t border-slate-300 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg, index) => {
              const isPopular = index === Math.floor(packages.length / 2);
              
              return (
                <AnimatedSection
                  key={pkg.name}
                  animationType="slide-up"
                  delay={index * 100}
                  className={`group relative flex flex-col overflow-hidden border-b border-r bg-white transition-colors hover:bg-blue-50/40 ${
                    isPopular
                      ? 'border-blue-700'
                      : 'border-slate-300'
                  }`}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute right-0 top-0 bg-blue-700 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                      {t('pricing.popular')}
                    </div>
                  )}

                  <div className="relative z-10 flex h-full flex-col p-8">
                    {/* Package Name */}
                    <h3 className="mb-3 text-2xl font-semibold tracking-[-0.025em] text-slate-950">
                      {pkg.name}
                    </h3>

                    {/* Description */}
                    <p className="mb-6 text-sm leading-6 text-slate-600">
                      {pkg.description}
                    </p>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-slate-500">
                          {t('pricing.from')}
                        </span>
                        <span className="text-4xl font-semibold tracking-[-0.04em] text-blue-700">
                          {formatPrice(pkg.price)}
                        </span>
                        <span className="text-lg text-slate-600">
                          {pkg.currency}
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-8 flex-grow">
                      <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                        {t('pricing.features')}:
                      </h4>
                      <ul className="space-y-2">
                        {pkg.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-2">
                            <svg
                              className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-700"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-sm leading-6 text-slate-600">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button - всегда внизу */}
                    <div className="mt-auto pt-4">
                      <button
                        onClick={scrollToContact}
                        className={`w-full border px-4 py-3 text-sm font-semibold transition-colors ${
                          isPopular
                            ? 'border-blue-700 bg-blue-700 text-white hover:bg-blue-800'
                            : 'border-slate-400 bg-transparent text-slate-950 hover:border-blue-700 hover:text-blue-700'
                        }`}
                      >
                        {t('pricing.contactButton')}
                      </button>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <AnimatedSection animationType="slide-up" delay={packages.length * 100}>
            <div className="mb-16 grid gap-8 border-y border-slate-300 bg-white p-8 md:grid-cols-2 md:p-12">
              <div>
              <h3 className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
                {t('pricing.contact')}
              </h3>
              <p className="text-lg leading-8 text-slate-600">
                {t('pricing.description')}
              </p>
              </div>
              <div className="flex flex-col justify-center gap-3 sm:flex-row md:flex-col">
                <button
                  onClick={scrollToChat}
                  className="bg-blue-700 px-8 py-4 font-semibold text-white transition-colors hover:bg-blue-800"
                >
                  {t('pricing.calculateButton')}
                </button>
                <button
                  onClick={scrollToContact}
                  className="border border-slate-400 bg-white px-8 py-4 font-semibold text-slate-950 transition-colors hover:border-blue-700 hover:text-blue-700"
                >
                  {t('pricing.contactButton')}
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
      
      {/* Contact Section */}
      <Contact />
    </section>
  );
}

