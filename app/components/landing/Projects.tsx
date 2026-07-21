'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getFeaturedProjects } from '../../data/projects';
import Image from 'next/image';
import AnimatedSection from '../common/AnimatedSection';
import { analyticsEvents } from '../../lib/analytics';
import { buildWhatsAppUrl, PRIMARY_WHATSAPP_NUMBER } from '../../lib/whatsapp';

export default function Projects() {
  const { t, language } = useLanguage();

  const allProjects = getFeaturedProjects();
  const [visibleCount, setVisibleCount] = useState(3);
  const projects = allProjects.slice(0, visibleCount);
  const hasMore = allProjects.length > visibleCount;

  const sectionLabel =
    language === 'en' ? 'Selected work' : language === 'kz' ? 'Таңдаулы жобалар' : 'Избранные работы';
  const casesLabel =
    language === 'en' ? 'CASES' : language === 'kz' ? 'ЖОБА' : 'КЕЙСОВ';

  return (
    <section id="projects" className="editorial-grid border-y border-[#11110f]">
      <div className="mx-auto max-w-[1440px] border-x border-[#cfcdc5] bg-[#f4f2ec]/92">
        <AnimatedSection animationType="slide-up" delay={0}>
          <div className="flex flex-col justify-between gap-6 border-b border-[#cfcdc5] px-5 py-12 sm:px-8 sm:py-16 lg:flex-row lg:items-end lg:px-12">
            <div>
              <p className="editorial-kicker">
                02 / {sectionLabel}
              </p>
              <h2 className="mt-8 text-[clamp(2.5rem,6vw,5.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.06em] text-[#11110f]">
                {t('projects.title')}
              </h2>
            </div>
            <span className="font-mono text-sm text-[#68675f]">
              {String(allProjects.length).padStart(2, '0')} {casesLabel}
            </span>
          </div>
        </AnimatedSection>

        <div className="divide-y divide-[#cfcdc5]">
          {projects.map((project, index) => (
            <AnimatedSection key={project.id} animationType="slide-up" delay={index * 90}>
              <article className="project-card group grid md:grid-cols-12">
                <div
                  className={`project-card__media relative min-h-[15rem] overflow-hidden bg-[#11110f] sm:min-h-[18rem] md:col-span-7 md:min-h-[22rem] lg:min-h-[26rem] ${
                    index % 2 === 1 ? 'md:order-2' : ''
                  }`}
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title[language]}
                      fill
                      priority={index === 0}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      quality={75}
                      unoptimized={process.env.NODE_ENV === 'development'}
                      className="project-card__image object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 58vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/40">
                      <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                  )}

                  <div className="project-card__shine" aria-hidden="true" />
                  <div className="project-card__overlay" aria-hidden="true" />

                  <span className="project-card__index">{String(index + 1).padStart(2, '0')}</span>

                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => analyticsEvents.projectLinkClick(project.title[language], project.live!)}
                      className="project-card__preview"
                    >
                      {t('projects.viewLive')} <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>

                <div
                  className={`project-card__body flex flex-col justify-between p-6 sm:p-8 md:col-span-5 lg:p-10 ${
                    index % 2 === 1 ? 'md:order-1 md:border-r md:border-[#cfcdc5]' : 'md:border-l md:border-[#cfcdc5]'
                  }`}
                >
                  <div>
                    <h3 className="project-card__title mb-4 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.04em] text-[#11110f]">
                      {project.title[language]}
                    </h3>
                    <p className="project-card__desc max-w-md text-sm leading-7 text-[#55544e] sm:text-base">
                      {project.description[language]}
                    </p>
                  </div>

                  <div className="mt-8">
                    <div className="mb-6 flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span key={tech} className="project-card__tag">
                          #{tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3 border-t border-[#cfcdc5] pt-5">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-card__btn project-card__btn--ghost"
                          >
                            {t('projects.viewCode')} <span aria-hidden="true">↗</span>
                          </a>
                        )}
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => analyticsEvents.projectLinkClick(project.title[language], project.live!)}
                            className="project-card__btn project-card__btn--ghost"
                          >
                            {t('projects.viewLive')} <span aria-hidden="true">↗</span>
                          </a>
                        )}
                        <a
                          href={buildWhatsAppUrl(t('home.projects.message').replace('{project}', project.title[language]))}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, `home_project_${project.id}`)}
                          className="project-card__btn project-card__btn--primary"
                        >
                          {t('home.projects.similar')} <span aria-hidden="true">↗</span>
                        </a>
                      </div>
                  </div>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 border-t border-[#cfcdc5] px-5 py-10 sm:px-8">
          {hasMore && (
            <button
              type="button"
              onClick={() => {
                setVisibleCount(allProjects.length);
                analyticsEvents.projectsShowAllToggle('show');
              }}
              className="inline-flex min-h-13 items-center bg-[#2446e8] px-8 py-4 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-[#1836c7]"
            >
              {t('projects.showMore')} <span className="ml-6" aria-hidden="true">↓</span>
            </button>
          )}
          {visibleCount > 3 && (
            <button
              type="button"
              onClick={() => {
                setVisibleCount(3);
                analyticsEvents.projectsShowAllToggle('hide');
              }}
              className="inline-flex min-h-13 items-center border border-[#11110f] px-8 py-4 text-sm font-bold hover:bg-[#11110f] hover:text-white"
            >
              {t('projects.showLess')} <span className="ml-6" aria-hidden="true">↑</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
