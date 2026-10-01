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
        'Meta Ads',
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

  const sectionLabel =
    language === 'en' ? 'Team stack' : language === 'kz' ? 'Команда стегі' : 'Компетенции команды';

  return (
    <section id="skills" className="border-b border-[#cfcdc5] bg-[#f4f2ec] py-16 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16">
        <AnimatedSection animationType="slide-up">
          <div className="grid gap-5 border-b-2 border-[#11110f] pb-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="editorial-kicker">04 / {sectionLabel}</p>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                {t('skills.title')}
              </h2>
            </div>
            <p className="text-sm leading-6 text-[#55544e] sm:text-base sm:leading-7 lg:col-span-4">
              {t('skills.subtitle')}
            </p>
          </div>
        </AnimatedSection>

        <div>
          {skillCategories.map((category, index) => {
            const isExpanded = expandedCategories[index] || false;
            const defaultCount = 6;
            const hasMore = category.skills.length > defaultCount;
            const visibleSkills = isExpanded ? category.skills : category.skills.slice(0, defaultCount);
            const panelId = `skills-panel-${index}`;

            return (
              <AnimatedSection key={category.title} animationType="slide-up" delay={index * 70}>
                <article className="editorial-row grid gap-4 py-7 lg:grid-cols-12 lg:items-start lg:gap-8">
                  <div className="lg:col-span-4">
                    <span className="editorial-num">0{index + 1}</span>
                    <h3 className="mt-1.5 text-xl font-bold tracking-[-0.03em] sm:text-2xl">{category.title}</h3>
                  </div>
                  <div className="lg:col-span-8">
                    <div id={panelId} className="flex flex-wrap gap-1.5 sm:gap-2">
                      {visibleSkills.map((skill) => (
                        <span key={skill} className="tech-pill">
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
                        className="link-underline mt-4 inline-flex min-h-11 items-center"
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
    </section>
  );
}
