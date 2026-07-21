'use client';

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../common/AnimatedSection';

interface ServiceExamplesProps {
  examplesKey?: string;
}

export default function ServiceExamples({ examplesKey }: ServiceExamplesProps) {
  const { t } = useLanguage();

  if (!examplesKey || t(examplesKey) === examplesKey) return null;

  return (
    <AnimatedSection animationType="slide-up" delay={500}>
      <div className="mb-20">
        <div className="mb-10 border-b border-slate-300 pb-6">
          <h2 className="text-4xl font-semibold tracking-[-0.04em] text-slate-950 md:text-5xl">
              {t('services.examples.title')}
          </h2>
        </div>
        <div className="border-l-2 border-blue-700 bg-white p-8 md:p-12">
          <div className="whitespace-pre-line text-lg leading-8 text-slate-700 md:text-xl">
            {t(examplesKey)}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}





