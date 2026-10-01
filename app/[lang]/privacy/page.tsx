import type { Metadata } from 'next';
import Header from '../../components/landing/EditorialHeader';
import Footer from '../../components/landing/Footer';
import { LanguageProvider } from '../../contexts/LanguageContext';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aidardev.kz';

type PrivacyLanguage = 'ru' | 'kz' | 'en';

interface PrivacySection {
  title: string;
  paragraphs?: string[];
  items?: string[];
  operator?: boolean;
}

interface PrivacyContent {
  title: string;
  description: string;
  kicker: string;
  intro: string;
  updatedLabel: string;
  updated: string;
  operator: {
    entity: string;
    idLabel: string;
    id: string;
    addressLabel: string;
    address: string;
    emailLabel: string;
    phoneLabel: string;
  };
  sections: PrivacySection[];
}

const EMAIL = 'aidar1910main@gmail.com';
const PHONE_DISPLAY = '+7 702 999 3696';
const PHONE_HREF = 'tel:+77029993696';
const TAX_ID = '030713550586';

// Редакция политики. Обновляйте дату вместе с текстом.
const UPDATED_ISO = '2026-10-01';

const content: Record<PrivacyLanguage, PrivacyContent> = {
  ru: {
    title: 'Политика конфиденциальности',
    description:
      'Как студия aidardev собирает, использует и хранит персональные данные из формы заявки на сайте aidardev.kz.',
    kicker: 'aidardev / Документы',
    intro:
      'Эта политика объясняет, какие персональные данные собирает сайт aidardev.kz, зачем они нужны и как мы с ними обращаемся. Политика подготовлена в соответствии с Законом Республики Казахстан от 21 мая 2013 года № 94-V «О персональных данных и их защите».',
    updatedLabel: 'Редакция от',
    updated: '1 октября 2026 года',
    operator: {
      entity: 'ИП «КУАТБЕКОВ»',
      idLabel: 'ИИН/БИН',
      id: TAX_ID,
      addressLabel: 'Адрес',
      address: 'г. Астана, район Нура, ул. Жубана Молдагалиева, 4к1, 010000',
      emailLabel: 'Email',
      phoneLabel: 'Телефон',
    },
    sections: [
      {
        title: '1. Кто обрабатывает данные',
        paragraphs: ['Оператор персональных данных — ИП «КУАТБЕКОВ» (студия aidardev).'],
        operator: true,
      },
      {
        title: '2. Какие данные мы собираем',
        paragraphs: ['Когда вы отправляете заявку через форму на сайте, мы получаем:'],
        items: [
          'имя;',
          'номер телефона;',
          'описание задачи — то, что вы написали в форме;',
          'адрес страницы, с которой отправлена заявка, и UTM-метки рекламной ссылки, если вы перешли по ней;',
          'IP-адрес и сведения о браузере — для защиты формы от спама.',
        ],
      },
      {
        title: '3. Зачем мы используем данные',
        items: [
          'чтобы ответить на вашу заявку и связаться с вами;',
          'чтобы подготовить оценку стоимости и сроков проекта.',
        ],
      },
      {
        title: '4. Где и сколько хранятся данные',
        paragraphs: [
          'Данные хранятся на защищённом сервере студии.',
          'Мы храним их, пока решается вопрос по вашей заявке, но не дольше 3 лет с момента её получения. После этого данные удаляются.',
        ],
      },
      {
        title: '5. Передача третьим лицам',
        paragraphs: [
          'Мы не продаём персональные данные третьим лицам. Раскрыть их мы можем только в случаях, прямо предусмотренных законодательством Республики Казахстан.',
        ],
      },
      {
        title: '6. Cookie и веб-аналитика',
        paragraphs: [
          'Сайт использует сервисы веб-аналитики Google Analytics, Яндекс Метрика и Microsoft Clarity. Они собирают сведения о посещениях: какие страницы вы открывали, как пользовались сайтом (клики, прокрутка), тип устройства и браузера, откуда вы пришли. Для этого используются файлы cookie.',
          'Отключить или удалить cookie можно в настройках браузера.',
        ],
      },
      {
        title: '7. Ваши права',
        paragraphs: [
          `Вы можете узнать, какие ваши данные у нас есть, попросить их исправить или удалить. Для этого напишите на ${EMAIL} — выполним запрос в сроки, установленные законодательством.`,
        ],
      },
      {
        title: '8. Согласие',
        paragraphs: [
          'Отправляя заявку через форму на сайте, вы соглашаетесь на обработку указанных в ней персональных данных на условиях этой политики.',
        ],
      },
      {
        title: '9. Изменения политики',
        paragraphs: ['Мы можем обновлять эту политику. Актуальная версия всегда опубликована на этой странице.'],
      },
    ],
  },
  kz: {
    title: 'Құпиялылық саясаты',
    description:
      'aidardev студиясы aidardev.kz сайтындағы өтінім формасынан алынған дербес деректерді қалай жинайды, пайдаланады және сақтайды.',
    kicker: 'aidardev / Құжаттар',
    intro:
      'Бұл саясат aidardev.kz сайты қандай дербес деректерді жинайтынын, олар не үшін қажет екенін және біз оларды қалай өңдейтінімізді түсіндіреді. Саясат «Дербес деректер және оларды қорғау туралы» Қазақстан Республикасының 2013 жылғы 21 мамырдағы № 94-V Заңына сәйкес әзірленген.',
    updatedLabel: 'Редакция күні:',
    updated: '2026 жылғы 1 қазан',
    operator: {
      entity: 'ЖК «КУАТБЕКОВ»',
      idLabel: 'ЖСН/БСН',
      id: TAX_ID,
      addressLabel: 'Мекенжай',
      address: 'Астана қ., Нұра ауданы, Жұбан Молдағалиев к-сі, 4к1, 010000',
      emailLabel: 'Email',
      phoneLabel: 'Телефон',
    },
    sections: [
      {
        title: '1. Деректерді кім өңдейді',
        paragraphs: ['Дербес деректер операторы — ЖК «КУАТБЕКОВ» (aidardev студиясы).'],
        operator: true,
      },
      {
        title: '2. Қандай деректерді жинаймыз',
        paragraphs: ['Сайттағы форма арқылы өтінім жібергенде біз мыналарды аламыз:'],
        items: [
          'атыңыз;',
          'телефон нөміріңіз;',
          'міндеттің сипаттамасы — формаға жазған мәтініңіз;',
          'өтінім жіберілген беттің мекенжайы және жарнамалық сілтеменің UTM-белгілері (егер сол сілтеме арқылы келсеңіз);',
          'IP-мекенжай және браузер туралы мәліметтер — форманы спамнан қорғау үшін.',
        ],
      },
      {
        title: '3. Деректерді не үшін пайдаланамыз',
        items: [
          'өтініміңізге жауап беру және сізбен байланысу үшін;',
          'жобаның құны мен мерзімін бағалау үшін.',
        ],
      },
      {
        title: '4. Деректер қайда және қанша уақыт сақталады',
        paragraphs: [
          'Деректер студияның қорғалған серверінде сақталады.',
          'Оларды өтініміңіз бойынша мәселе шешілгенше сақтаймыз, бірақ өтінім келіп түскен күннен бастап 3 жылдан аспайды. Осы мерзімнен кейін деректер жойылады.',
        ],
      },
      {
        title: '5. Үшінші тұлғаларға беру',
        paragraphs: [
          'Дербес деректерді үшінші тұлғаларға сатпаймыз. Оларды тек Қазақстан Республикасының заңнамасында тікелей көзделген жағдайларда ғана ашуымыз мүмкін.',
        ],
      },
      {
        title: '6. Cookie және веб-аналитика',
        paragraphs: [
          'Сайт Google Analytics, Яндекс Метрика және Microsoft Clarity веб-аналитика сервистерін пайдаланады. Олар сайтқа кірулер туралы мәліметтерді жинайды: қандай беттерді ашқаныңызды, сайтты қалай пайдаланғаныңызды (басулар, айналдыру), құрылғы мен браузер түрін және қайдан келгеніңізді. Ол үшін cookie файлдары қолданылады.',
          'Cookie файлдарын браузер баптауларынан өшіруге немесе жоюға болады.',
        ],
      },
      {
        title: '7. Сіздің құқықтарыңыз',
        paragraphs: [
          `Бізде сіз туралы қандай деректер бар екенін біле аласыз, оларды түзетуді немесе жоюды сұрай аласыз. Ол үшін ${EMAIL} мекенжайына жазыңыз — сұрауыңызды заңнамада белгіленген мерзімде орындаймыз.`,
        ],
      },
      {
        title: '8. Келісім',
        paragraphs: [
          'Сайттағы форма арқылы өтінім жібере отырып, сіз онда көрсетілген дербес деректердің осы саясат шарттарымен өңделуіне келісім бересіз.',
        ],
      },
      {
        title: '9. Саясаттың өзгеруі',
        paragraphs: ['Бұл саясатты жаңартуымыз мүмкін. Өзекті нұсқасы әрқашан осы бетте жарияланады.'],
      },
    ],
  },
  en: {
    title: 'Privacy policy',
    description:
      'How the aidardev studio collects, uses and stores personal data from the request form on aidardev.kz.',
    kicker: 'aidardev / Legal',
    intro:
      'This policy explains what personal data the aidardev.kz website collects, why we need it and how we handle it. It is prepared in accordance with Law of the Republic of Kazakhstan No. 94-V of 21 May 2013 “On Personal Data and Their Protection”.',
    updatedLabel: 'Last updated:',
    updated: '1 October 2026',
    operator: {
      entity: 'IE “KUATBEKOV”',
      idLabel: 'IIN/BIN',
      id: TAX_ID,
      addressLabel: 'Address',
      address: '4k1 Zhuban Moldagaliyev St, Nura district, Astana 010000',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
    },
    sections: [
      {
        title: '1. Who processes the data',
        paragraphs: ['The personal data operator is IE “KUATBEKOV” (aidardev studio).'],
        operator: true,
      },
      {
        title: '2. What data we collect',
        paragraphs: ['When you send a request through the form on the site, we receive:'],
        items: [
          'your name;',
          'your phone number;',
          'the task description you entered in the form;',
          'the address of the page the request was sent from and the UTM tags of the ad link, if you came from one;',
          'your IP address and browser details, used to protect the form from spam.',
        ],
      },
      {
        title: '3. Why we use it',
        items: [
          'to reply to your request and contact you;',
          'to prepare an estimate of the project cost and timeline.',
        ],
      },
      {
        title: '4. Where and how long we store it',
        paragraphs: [
          'The data is stored on the studio’s secure server.',
          'We keep it until your request is resolved, and no longer than 3 years from the date we received it. After that, the data is deleted.',
        ],
      },
      {
        title: '5. Third parties',
        paragraphs: [
          'We do not sell personal data to third parties. We may disclose it only in cases expressly provided for by the law of the Republic of Kazakhstan.',
        ],
      },
      {
        title: '6. Cookies and analytics',
        paragraphs: [
          'The site uses the Google Analytics, Yandex Metrica and Microsoft Clarity web analytics services. They collect information about visits: which pages you opened, how you used the site (clicks, scrolling), your device and browser type, and where you came from. They use cookies for this.',
          'You can disable or delete cookies in your browser settings.',
        ],
      },
      {
        title: '7. Your rights',
        paragraphs: [
          `You can ask what data we hold about you and request that it be corrected or deleted. To do so, email ${EMAIL} — we will handle your request within the time limits set by law.`,
        ],
      },
      {
        title: '8. Consent',
        paragraphs: [
          'By sending a request through the form on the site, you agree to the processing of the personal data you provide under this policy.',
        ],
      },
      {
        title: '9. Changes',
        paragraphs: ['We may update this policy. The current version is always published on this page.'],
      },
    ],
  },
};

function normalizeLanguage(lang: string): PrivacyLanguage {
  return lang === 'en' || lang === 'kz' || lang === 'ru' ? lang : 'ru';
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = normalizeLanguage(rawLang);
  const page = content[lang];

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `${siteUrl}/${lang}/privacy`,
      languages: {
        ru: `${siteUrl}/ru/privacy`,
        en: `${siteUrl}/en/privacy`,
        kk: `${siteUrl}/kz/privacy`,
      },
    },
    openGraph: {
      type: 'website',
      locale: lang === 'ru' ? 'ru_RU' : lang === 'en' ? 'en_US' : 'kk_KZ',
      url: `${siteUrl}/${lang}/privacy`,
      siteName: 'aidardev',
      title: page.title,
      description: page.description,
    },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = normalizeLanguage(rawLang);
  const page = content[lang];

  return (
    <LanguageProvider initialLanguage={lang}>
      <div className="min-h-screen bg-[#f7f7f5] text-slate-950">
        <Header />
        <main className="pb-20 pt-32">
          <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <article className="mx-auto max-w-3xl">
              <header className="mb-12 border-y border-slate-300 py-10 md:py-14">
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">{page.kicker}</p>
                <h1 className="text-4xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-6xl">{page.title}</h1>
                <p className="mt-6 text-lg leading-8 text-slate-600">{page.intro}</p>
                <p className="mt-4 text-sm text-slate-500">
                  {page.updatedLabel} <time dateTime={UPDATED_ISO}>{page.updated}</time>
                </p>
              </header>

              <div className="space-y-10">
                {page.sections.map((section) => (
                  <section key={section.title}>
                    <h2 className="mb-4 text-2xl font-semibold tracking-[-0.02em] text-slate-950">{section.title}</h2>
                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph} className="mb-3 text-base leading-7 text-slate-700">
                        {paragraph}
                      </p>
                    ))}
                    {section.items && (
                      <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-slate-700">
                        {section.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {section.operator && (
                      <div className="mt-4 border border-slate-300 bg-white p-6 text-base leading-7 text-slate-700">
                        <p className="mb-2 font-semibold text-slate-950">{page.operator.entity}</p>
                        <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[auto_1fr]">
                          <dt className="text-slate-500">{page.operator.idLabel}</dt>
                          <dd>{page.operator.id}</dd>
                          <dt className="text-slate-500">{page.operator.addressLabel}</dt>
                          <dd>{page.operator.address}</dd>
                          <dt className="text-slate-500">{page.operator.emailLabel}</dt>
                          <dd>
                            <a href={`mailto:${EMAIL}`} className="text-blue-700 hover:text-blue-900">
                              {EMAIL}
                            </a>
                          </dd>
                          <dt className="text-slate-500">{page.operator.phoneLabel}</dt>
                          <dd>
                            <a href={PHONE_HREF} className="whitespace-nowrap text-blue-700 hover:text-blue-900">
                              {PHONE_DISPLAY}
                            </a>
                          </dd>
                        </dl>
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </article>
          </section>
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
