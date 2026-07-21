'use client';

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../common/AnimatedSection';

interface ServiceProcessProps {
  processKey?: string;
}

export default function ServiceProcess({ processKey }: ServiceProcessProps) {
  const { t } = useLanguage();

  if (!processKey || t(processKey) === processKey) return null;

  return (
    <AnimatedSection animationType="slide-up" delay={400}>
      <div className="mb-20">
        <div className="mb-10 border-b border-slate-300 pb-6">
          <h2 className="text-4xl font-semibold tracking-[-0.04em] text-slate-950 md:text-5xl">
              {t('services.process.title')}
          </h2>
        </div>
        <div className="border-l-2 border-blue-700 bg-white p-8 md:p-12">
          <div className="whitespace-pre-line text-lg leading-8 text-slate-700 md:text-xl">
            {t(processKey)}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}





