'use client';

import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../common/AnimatedSection';
import { analyticsEvents } from '../../lib/analytics';

export default function Skills() {
  const { t, language } = useLanguage();
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});

  const skillCategories = [
    {
      title: t('skills.product'),
      skills: [
        'React', 'Next.js', 'TypeScript', 'Vue.js', 'NestJS', 'Node.js',
        'Python', 'PostgreSQL', 'MongoDB', 'REST API', 'Docker', 'Vercel',
        'React Native', 'Telegram Bots', 'WhatsApp Bots',
      ],
    },
    {
      title: t('skills.marketing'),
      skills: [
        'SEO',
        language === 'en' ? 'Contextual ads' : language === 'kz' ? 'Контекстік жарнама' : 'Контекстная реклама',
        language === 'en' ? 'Targeted ads' : language === 'kz' ? 'Таргет' : 'Таргет',
        'Google Ads',
        'Yandex Direct',
        language === 'en' ? 'Meta Ads' : 'Meta Ads',
        language === 'en' ? 'Landing funnels' : language === 'kz' ? 'Лендинг воронкалары' : 'Воронки и лендинги',
        language === 'en' ? 'Analytics' : language === 'kz' ? 'Аналитика' : 'Аналитика',
        'GA4',
        language === 'en' ? 'Yandex Metrika' : 'Яндекс Метрика',
        language === 'en' ? 'Content marketing' : language === 'kz' ? 'Контент-маркетинг' : 'Контент-маркетинг',
        language === 'en' ? 'Lead gen' : language === 'kz' ? 'Лид генерация' : 'Лидогенерация',
      ],
    },
    {
      title: t('skills.aiOps'),
      skills: [
        'OpenAI', 'GPT', 'Claude', 'LangChain',
        language === 'en' ? 'AI chatbots' : language === 'kz' ? 'AI чатботтар' : 'AI-чатботы',
        language === 'en' ? 'CRM automation' : language === 'kz' ? 'CRM автоматтандыру' : 'CRM-автоматизация',
        'Figma', 'CI/CD', 'AWS', 'Supabase', 'Stripe', 'Kaspi Pay',
      ],
    },
  ];

  const toggleCategory = (index: number) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section id="skills" className="border-y border-slate-800 bg-slate-950 py-16 text-white sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection animationType="slide-up" delay={0}>
            <div className="mb-10 grid gap-4 lg:grid-cols-12 lg:items-end">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-blue-400 lg:col-span-3">
                03 / {language === 'en' ? 'Team stack' : language === 'kz' ? 'Команда стегі' : 'Компетенции команды'}
              </p>
              <div className="lg:col-span-9">
                <h2 className="text-3xl font-black tracking-[-0.04em] sm:text-5xl">{t('skills.title')}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                  {t('skills.subtitle')}
                </p>
              </div>
            </div>
          </AnimatedSection>

          <div className="border-t border-slate-700">
            {skillCategories.map((category, index) => {
              const isExpanded = expandedCategories[index] || false;
              const defaultCount = 6;
              const hasMore = category.skills.length > defaultCount;
              const visibleSkills = isExpanded ? category.skills : category.skills.slice(0, defaultCount);
              const panelId = `skills-panel-${index}`;

              return (
                <AnimatedSection key={category.title} animationType="slide-up" delay={index * 80}>
                  <article className="grid gap-4 border-b border-slate-700 py-6 lg:grid-cols-12 lg:items-start">
                    <div className="lg:col-span-4">
                      <span className="mb-2 block font-mono text-[11px] text-blue-400">0{index + 1}</span>
                      <h3 className="text-xl font-bold tracking-tight sm:text-2xl">{category.title}</h3>
                    </div>
                    <div className="lg:col-span-8">
                      <div id={panelId} className="flex flex-wrap gap-1.5">
                        {visibleSkills.map((skill) => (
                          <span
                            key={skill}
                            className="border border-slate-700 px-2.5 py-1.5 text-xs text-slate-300 transition-colors hover:border-blue-400 hover:text-blue-300 sm:text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      {hasMore ? (
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          aria-controls={panelId}
                          onClick={() => {
                            toggleCategory(index);
                            analyticsEvents.skillCategoryToggle(category.title, isExpanded ? 'close' : 'open');
                          }}
                          className="mt-4 border-b border-blue-400 pb-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-400 hover:text-white"
                        >
                          {isExpanded
                            ? t('skills.showLess')
                            : `${t('skills.showMore')} ${category.skills.length - defaultCount}`}
                        </button>
                      ) : null}
                    </div>
                  </article>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
