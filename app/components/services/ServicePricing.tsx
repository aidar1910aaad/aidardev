'use client';

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../common/AnimatedSection';
import { analyticsEvents } from '../../lib/analytics';
import pricingData from '../../data/pricing.json';
import { ServiceKey } from '../../data/services-config';

interface ServicePricingProps {
  serviceKey: ServiceKey;
}

interface PricingPackage {
  key: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
}

type PricingSourcePackage = Omit<PricingPackage, 'key'>;

export default function ServicePricing({ serviceKey }: ServicePricingProps) {
  const { t } = useLanguage();

  // Получаем пакеты для данного сервиса
  const packages: PricingPackage[] = React.useMemo(() => {
    const serviceData = (pricingData.services as Record<string, Record<string, PricingSourcePackage>>)[serviceKey];
    if (!serviceData) return [];
    
    return Object.entries(serviceData).map(([key, pkg]) => {
      const translationKey = `pricing.packages.${serviceKey}.${key}`;
      
      return {
        key,
        name: t(`${translationKey}.name`) || pkg.name,
        price: pkg.price,
        currency: pkg.currency,
        description: t(`${translationKey}.description`) || pkg.description,
        features: pkg.features.map((feature: string, index: number) => 
          t(`${translationKey}.features.${index}`) || feature
        ),
      };
    });
  }, [serviceKey, t]);

  if (packages.length === 0) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'auto' });
      analyticsEvents.scrollToSection('contact');
    }
  };

  // Определяем популярный пакет (обычно третий или средний)
  const popularIndex = packages.length >= 3 ? Math.floor(packages.length / 2) : -1;

  return (
    <AnimatedSection animationType="slide-up" delay={450}>
      <div className="pt-20 mb-20">
        <div className="mb-10 border-b border-slate-300 pb-6">
          <h2 className="text-4xl font-semibold tracking-[-0.04em] text-slate-950 md:text-5xl">
              {t('services.pricing.title')}
          </h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 border-l border-t border-slate-300 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, index) => {
            const isPopular = index === popularIndex;
            
            return (
              <AnimatedSection
                key={pkg.key}
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
                  <div className="absolute right-0 top-0 z-20 bg-blue-700 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                    {t('pricing.popular')}
                  </div>
                )}

                <div className="p-8 relative z-10 flex flex-col h-full">
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
                      <span className="text-sm text-gray-500 dark:text-gray-500 font-light tracking-wide">
                        {t('pricing.from')}
                      </span>
                      <span className="text-4xl font-semibold tracking-[-0.04em] text-blue-700">
                        {formatPrice(pkg.price)}
                      </span>
                      <span className="text-lg text-gray-600 dark:text-gray-400 font-light">
                        {pkg.currency}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-8 flex-grow">
                    <h4 className="text-sm font-light text-gray-700 dark:text-gray-300 mb-4 tracking-wide">
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
                          <span className="text-sm text-gray-600 dark:text-gray-400 font-light tracking-wide">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-auto pt-4">
                    <button
                      onClick={scrollToContact}
                      className={`w-full border px-4 py-3 text-sm font-semibold transition-colors ${
                        isPopular
                          ? 'border-blue-700 bg-blue-700 text-white hover:bg-blue-800'
                          : 'border-slate-400 text-slate-950 hover:border-blue-700 hover:text-blue-700'
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
      </div>
    </AnimatedSection>
  );
}

