import { navigation } from './navigation';
import { hero } from './hero';
import { about } from './about';
import { skills } from './skills';
import { projects } from './projects';
import { testimonials } from './testimonials';
import { process } from './process';
import { faq } from './faq';
import { contact } from './contact';
import { chatbot } from './chatbot';
import { footer } from './footer';
import { pricingTranslations } from './pricing';
import { servicesTranslations } from './services';
import { notFound } from './not-found';
import { home } from './home';

import type { Language } from '../LanguageContext';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    ...navigation.en,
    ...hero.en,
    ...about.en,
    ...skills.en,
    ...projects.en,
    ...testimonials.en,
    ...process.en,
    ...faq.en,
    ...contact.en,
    ...chatbot.en,
    ...footer.en,
    ...pricingTranslations.en,
    ...servicesTranslations.en,
    ...notFound.en,
    ...home.en,
  },
  ru: {
    ...navigation.ru,
    ...hero.ru,
    ...about.ru,
    ...skills.ru,
    ...projects.ru,
    ...testimonials.ru,
    ...process.ru,
    ...faq.ru,
    ...contact.ru,
    ...chatbot.ru,
    ...footer.ru,
    ...pricingTranslations.ru,
    ...servicesTranslations.ru,
    ...notFound.ru,
    ...home.ru,
  },
  kz: {
    ...navigation.kz,
    ...hero.kz,
    ...about.kz,
    ...skills.kz,
    ...projects.kz,
    ...testimonials.kz,
    ...process.kz,
    ...faq.kz,
    ...contact.kz,
    ...chatbot.kz,
    ...footer.kz,
    ...pricingTranslations.kz,
    ...servicesTranslations.kz,
    ...notFound.kz,
    ...home.kz,
  },
};

