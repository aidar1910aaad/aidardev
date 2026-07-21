'use client';

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Process() {
  const { t } = useLanguage();

  const steps = [
    {
      number: '01',
      title: t('process.step1.title'),
      description: t('process.step1.description'),
      duration: t('process.step1.duration'),
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      number: '02',
      title: t('process.step2.title'),
      description: t('process.step2.description'),
      duration: t('process.step2.duration'),
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      number: '03',
      title: t('process.step3.title'),
      description: t('process.step3.description'),
      duration: t('process.step3.duration'),
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      number: '04',
      title: t('process.step4.title'),
      description: t('process.step4.description'),
      duration: t('process.step4.duration'),
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      number: '05',
      title: t('process.step5.title'),
      description: t('process.step5.description'),
      duration: t('process.step5.duration'),
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="process" className="relative py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-cyan-50/30 to-blue-50/30 dark:from-gray-950 dark:via-cyan-950/20 dark:to-blue-950/20"></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-light mb-6 tracking-wider">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-600 to-orange-600 dark:from-blue-400 dark:via-cyan-400 dark:to-orange-400 font-light">
                {t('process.title')}
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light tracking-wide">
              {t('process.subtitle')}
            </p>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-orange-600 mx-auto rounded-full mt-8"></div>
          </div>

          {/* Process Steps - Wider Layout */}
          <div className="relative">
            {/* Steps Grid - 3 колонки на десктопе для большей ширины */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative group"
                >
                  {/* Connecting Arrow (desktop only) - между карточками */}
                  {/* Стрелка между карточками в первой строке (0-1, 1-2) */}
                  {index < 2 && (
                    <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-[92%] -translate-y-1/2 z-20 pointer-events-none">
                      <svg 
                        className="w-12 h-12 text-blue-500/60 dark:text-orange-500/60" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  )}
                  {/* Стрелка между карточками во второй строке (3-4) */}
                  {index === 3 && (
                    <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-[92%] -translate-y-1/2 z-20 pointer-events-none">
                      <svg 
                        className="w-12 h-12 text-blue-500/60 dark:text-orange-500/60" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Step Card - более широкая карточка */}
                  <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl p-10 lg:p-12 border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-orange-500/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 h-full flex flex-col">
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-cyan-600/0 to-orange-600/0 group-hover:from-blue-600/10 group-hover:via-cyan-600/10 group-hover:to-orange-600/10 rounded-3xl transition-all duration-500 pointer-events-none"></div>
                    
                    {/* Step Number and Icon Row */}
                    <div className="flex items-start justify-between mb-8">
                      {/* Step Number */}
                      <div className="text-8xl lg:text-9xl font-light text-gray-100 dark:text-gray-800/50 tracking-tighter leading-none">
                        {step.number}
                      </div>
                      
                      {/* Icon */}
                      <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 to-orange-600 rounded-3xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-blue-500/30 dark:shadow-orange-500/30 flex-shrink-0">
                        <div className="scale-125">
                          {step.icon}
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl lg:text-4xl font-light mb-6 text-gray-900 dark:text-white tracking-wide">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 mb-8 font-light leading-relaxed tracking-wide text-lg lg:text-xl flex-grow">
                      {step.description}
                    </p>

                    {/* Duration Badge */}
                    <div className="flex items-center justify-start px-5 py-3 bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-950/30 dark:to-orange-950/30 rounded-xl text-base text-gray-700 dark:text-gray-300 font-light w-fit border border-blue-200/50 dark:border-orange-800/50">
                      <svg className="w-5 h-5 mr-3 text-blue-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-light">{step.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

