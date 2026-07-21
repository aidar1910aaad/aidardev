'use client';

import React, { useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import StructuredData from '../SEO/StructuredData';
import { createServiceSchema, createBreadcrumbSchema } from '../../lib/schemas';
import { ServiceKey } from '../../data/services-config';
import ServiceHeader from './ServiceHeader';
import ServiceCards from './ServiceCards';
import ServiceContent from './ServiceContent';
import ServiceProcess from './ServiceProcess';
import ServiceExamples from './ServiceExamples';
import ServicePricing from './ServicePricing';
import ServiceFAQ from './ServiceFAQ';
import ServiceCTA from './ServiceCTA';
import RelatedServices from './RelatedServices';
import ServiceStickyWhatsApp from './ServiceStickyWhatsApp';
import Link from 'next/link';

interface ServicePageTemplateProps {
  serviceKey: ServiceKey;
  h1Key: string;
  introKey: string;
  contentKey: string;
  processKey?: string;
  examplesKey?: string;
  faqKey: string;
}

export default function ServicePageTemplate({
  serviceKey,
  h1Key,
  introKey,
  contentKey,
  processKey,
  examplesKey,
  faqKey,
}: ServicePageTemplateProps) {
  const { t, language } = useLanguage();

  // Структурированные данные для услуги
  const serviceSchema = useMemo(() => createServiceSchema({
    name: t(h1Key),
    description: t(introKey),
    provider: 'Aidar',
    areaServed: 'Kazakhstan',
  }), [t, h1Key, introKey]);

  // Breadcrumbs для навигации и SEO
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';
  const breadcrumbItems = useMemo(() => {
    const langPrefix = `/${language}`;
    const serviceName = t(h1Key);
    
    // Получаем переводы для breadcrumbs
    const homeLabel = language === 'en' ? 'Home' : language === 'kz' ? 'Басты' : 'Главная';
    const servicesLabel = language === 'en' ? 'Services' : language === 'kz' ? 'Қызметтер' : 'Услуги';
    
    return [
      { name: homeLabel, url: `${siteUrl}${langPrefix}`, path: langPrefix },
      { name: servicesLabel, url: `${siteUrl}${langPrefix}/services`, path: `${langPrefix}/services` },
      { name: serviceName, url: `${siteUrl}${langPrefix}/services/${serviceKey}`, path: `${langPrefix}/services/${serviceKey}` },
    ];
  }, [language, t, h1Key, serviceKey, siteUrl]);

  const breadcrumbSchema = useMemo(() => createBreadcrumbSchema(breadcrumbItems), [breadcrumbItems]);

  // Введение (текст перед карточками)
  const introContent = useMemo(() => {
    const content = t(contentKey);
    const includeIndex = content.indexOf('Мои услуги включают:');
    const servicesIndex = content.indexOf('My services include:');
    const startIndex = Math.max(includeIndex, servicesIndex);
    if (startIndex === -1) return undefined;
    return content.substring(0, startIndex).trim();
  }, [t, contentKey]);

  return (
    <>
      <StructuredData data={serviceSchema} />
      <StructuredData data={breadcrumbSchema} />
      
      <section className="border-b border-slate-300 bg-[#f7f7f5] pb-4 pt-32 text-slate-950">
        {/* Breadcrumbs */}
        <div className="container mx-auto mb-8 px-4 sm:px-6 lg:px-8">
          <nav className="border-b border-slate-300 pb-5 text-xs uppercase tracking-[0.12em]" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              {breadcrumbItems.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  {index > 0 && (
                    <span className="text-gray-400 dark:text-gray-500 mx-1">/</span>
                  )}
                  {index < breadcrumbItems.length - 1 ? (
                    <Link
                      href={item.path}
                      className="text-slate-500 transition-colors hover:text-blue-700"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <span className="text-slate-900">
                      {item.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <ServiceHeader 
              h1Key={h1Key}
              introKey={introKey}
              introContent={introContent}
              serviceKey={serviceKey}
            />

            <ServiceCards contentKey={contentKey} serviceKey={serviceKey} />

            <ServiceContent contentKey={contentKey} serviceKey={serviceKey} />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-300 bg-[#f7f7f5]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <ServiceProcess processKey={processKey} />
            <ServiceExamples examplesKey={examplesKey} />
            <ServicePricing serviceKey={serviceKey} />
          </div>
          
          <div className="max-w-4xl mx-auto">
            <ServiceFAQ faqKey={faqKey} />

            <RelatedServices currentServiceKey={serviceKey} />

            <ServiceCTA serviceKey={serviceKey} />
          </div>
        </div>
      </section>
      <ServiceStickyWhatsApp serviceKey={serviceKey} />
    </>
  );
}
