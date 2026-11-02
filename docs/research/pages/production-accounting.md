# production-accounting: заметка исследования (02.11.2026)

Ограничения этого прохода: WebFetch не открыл ни один нужный сайт (tulip.co, toolradar.com, mrpeasy.com, katanamrp.com не разрешены в сетевых настройках сессии), поэтому всё ниже взято из сводок поисковой выдачи WebSearch, первоисточники целиком не читали. Общий лимит поисков на ход исчерпался после 16 запросов, раздел про реальные поисковые формулировки в РК закрыт не полностью.

## Что проверили

- Tulip: что продаёт, единица оплаты, цены, откуда фраза про «оправдан только у крупных».
- Katana: актуальное название, тарифная модель, цены, интеграции.
- MRPeasy: тарифы и цены за пользователя.
- 1С для Казахстана: какие производственные конфигурации реально есть и обновляются (ERP 2, УПП, УНФ, УТ, Бухгалтерия), что с поддержкой УПП.
- MES vs ERP vs 1С:УНФ: когда MES не нужна.
- Термины glossary (MES, ERP, MRP, WIP, OEE), закон о персональных данных.
- Поисковые формулировки по «учёт производства» в РК (частично).

## Источники

- Tulip: no-code платформа «frontline operations», приложения на интерфейсах в цеху, с апреля 2024 продаёт Composable MES App Suite для дискретного производства: https://tulip.co/press/tulip-launches-composable-mes-app-suite-to-accelerate-time-to-value-for-discrete-manufacturers/ ; https://appsource.microsoft.com/product/SaaS/tulipinterfacesinc.offer_frontline_operations
- Tulip: оплата за интерфейс (устройство/станцию), Essentials около $100 за интерфейс в месяц, Professional около $250: https://toolradar.com/tools/tulip/pricing
- Tulip: минимум 10 интерфейсов, $100 за интерфейс в месяц при оплате за год, Essentials до 50 интерфейсов: https://erpresearch.com/erp-add-ons/manufacturing-mes-plm/tulip/pricing
- Tulip, расхождение: TrustRadius даёт $1 200 в год за интерфейс (минимум 5) и $2 400 в год (минимум 10) для Professional: https://www.trustradius.com/products/tulip-interfaces/pricing
- Tulip, Capterra пишет про оплату «за физическую площадку/станцию» и предлагает уточнять у вендора: https://www.capterra.co.uk/software/180620/tulip
- Критика Tulip: ToolRadar называет цены за интерфейс высокими и «best for mid-sized to large enterprises». Дословная фраза «only financially justifiable for larger» принадлежит не ToolRadar, а сайту сравнений Pulse Signal: https://toolradar.com/tools/tulip/pricing ; https://getpulsesignal.com/compare/textexpander-vs-tulip
- Katana: в маркетплейсах продукт называется Katana Cloud Inventory (старый слаг Katana MRP): https://apps.shopify.com/katana-mrp-manufacturing-and-inventory-management?locale=es ; https://www.capterra.com/p/172888/Katana-MRP/alternatives/
- Katana: CostBench 2026 описывает Free, Core $299 в месяц и Advantage по запросу; другие агрегаторы дают старую сетку Starter $179/199, Standard $359/399, Professional $799/899, Professional Plus от $1 799: https://costbench.com/software/inventory-management/katana-mrp/ ; https://zoftwarehub.com/products/katana-mrp/pricing ; https://tekpon.com/software/katana-manufacturing-erp/pricing
- Katana: нативные интеграции с QuickBooks Online, Xero, Shopify, WooCommerce: https://katanamrp.com/integrations/
- MRPeasy: Starter $49, Professional $69, Enterprise $99, Unlimited $149 за пользователя в месяц: https://erpresearch.com/pricing/mrpeasy ; https://www.getapp.com/operations-management-software/a/mrpeasy/pricing/ ; https://www.costbench.com/compare/mrpeasy-vs-katana/
- MRPeasy, расхождения: ToolRadar дает евро 39/59/79/125, Dupple $59/$99: https://toolradar.com/tools/mrpeasy/pricing ; https://dupple.com/reviews/mrpeasy
- 1С:ERP Управление предприятием 2 для Казахстана существует, релизы 2.4.5.x выходят в 2025-2026: https://pro1c.kz/news/avtomatizatsiya/vypusk-reliza-2-4-5-21-programmnogo-produkta-1s-erp-upravlenie-predpriyatiem-2-dlya-kazakhstana/ ; https://infostart.ru/journal/news/mir-1s/kazakhstan-obzavelsya-sobstvennoy-erp-sistemoy-ot-1s_536608
- 1С:УПП 8 для Казахстана: релиз 1.3.27.2 от 26.02.2026 (продукт ещё обновляется): https://pro1c.kz/update/?PRODUCT_ID=473
- 1С сворачивает поддержку УПП (российские материалы, срок «после 2026»): https://infostart.ru/journal/news/mir-1s/1s-prekrashchaet-podderzhku-resheniy-na-baze-1s-upp_1023646/ ; https://infostart.ru/journal/news/mir-1s/prekrashchenie-podderzhki-1s-upp-i-1s-ut-10-3-zaplaniruyte-perekhod-poka-ne-pozdno_1773216/
- 1С:УНФ для Казахстана: для мелкосерийного и позаказного производства, интеграция с 1С:Бухгалтерией для Казахстана: https://www.1cbit.kz/blog/upravlenie-nashey-firmoy-avtomatizatsiya-ucheta-vsekh-protsessov/
- В 1С:УНФ есть документ «Заказ на производство», к нему делают формы с операциями и исполнителями: https://infostart.ru/1c/articles/2323828/ ; https://infostart.ru/1c/reports/2703516/
- 1С:Управление торговлей для Казахстана, редакция 3 (релизы 3.4.4.x): https://infostart.ru/public/1694970/
- MES при штучном выпуске 1-10 изделий в месяц обычно не нужна, хватает ERP с модулем производства; внедрение MES 6-18 месяцев (блог российского интегратора, не независимый источник): https://toolfox.ru/services/proizvodstvo-soft/mes-sistemy
- Совет «для небольшого производства подойдет 1С:УНФ» (комментарии Habr): https://habr.com/en/companies/k2tech/articles/796981/comments
- Реальные формулировки тем в РК и СНГ: «Учет производства в программе 1С:Бухгалтерия для Казахстана» (cdb.kz), «Автоматизация производства, какую программу выбрать?» (Infostart), «Как правильно выбрать программный продукт фирмы 1С» (uchet.kz): https://cdb.kz/sistema/biblioteka-bukhgaltera/articles/uchet-proizvodstva-v-programme-1s-bukhgalteriya-dlya-kazakhstana-8-1 ; https://infostart.ru/public/993142/ ; https://uchet.kz/news/kak-pravilno-vybrat-programmnyy-produkt-firmy-1s-kotoryy-nuzhen-dlya-vashego-ucheta-/
- Наше прошлое исследование с теми же ценами: /home/user/aidardev/docs/research/shop_floor.md (раздел 3), report.md (строки 15-16, 43, 53).

## Что исправили на странице

- compare, Tulip: «конструктор приложений» заменили на «no-code платформу для цеха»; единица оплаты уточнена (интерфейс, то есть устройство на станции); добавлены цены около $100 и $250 за интерфейс в месяц, минимум 10, оплата за год, с пометкой «по данным агрегаторов ToolRadar и ERP Research» вместо «по данным вендора» (страницу вендора не открыли).
- Критика Tulip: было «в отзывах на ToolRadar критикуют, что оправдан у крупных клиентов». У ToolRadar это редакционный обзор цен, а не отзывы пользователей, и формулировка мягче: «подходит прежде всего средним и крупным компаниям». Переписали в compare и в FAQ.
- compare, Katana: добавили текущее название Katana Cloud Inventory, модель оплаты (фиксированный тариф, не за пользователя), цену от $299 в месяц по данным CostBench с оговоркой о расхождениях, конкретные интеграции (Shopify, WooCommerce, QuickBooks, Xero).
- compare, MRPeasy: добавили тарифы $49/$69/$99/$149 за пользователя в месяц со ссылкой на агрегаторы.
- compare intro и note: убрали «по данным вендоров», указали, что цены от агрегаторов на ноябрь 2026 и расходятся; «интеграции с 1С нет из коробки» смягчили до «готового обмена с 1С мы не нашли»; модель оплаты описана точно (станция, пользователь или фиксированный тариф).
- integrations: названия 1С приведены к казахстанским редакциям (УПП для Казахстана, 1С:ERP Управление предприятием 2 для Казахстана, УТ и Бухгалтерия для Казахстана), добавлена 1С:УНФ для Казахстана. Убрали «1С:УТ 11»: в РК продаётся «Управление торговлей для Казахстана, ред. 3», подтвердить, что она на базе УТ 11, не удалось. Добавили обмен файлами для старых конфигураций.
- FAQ «Что такое MES-lite?» (дублировал глоссарий) заменили на реальный вопрос «Какую программу выбрать для учёта небольшого производства?» с честным ответом: при документальном учёте хватает 1С:Бухгалтерии или 1С:УНФ, при нескольких изделиях в месяц MES не нужна.
- FAQ про 1С: теперь «Почему не 1С:ERP, УПП или УНФ», упомянуто, что в ERP и УНФ есть заказы на производство, что УПП для Казахстана ещё обновляется, но в России 1С сворачивает её поддержку.
- Глоссарий: MES дополнен уровнем 3 по ISA-95; MES-lite и MRP уточнены; ERP дополнена производством на уровне документов.
- security и FAQ о данных: указано точное название закона «О персональных данных и их защите» и требование хранить базы в РК, с пометкой «контекст, не юридическая консультация».
- lead: «без оплаты за каждый станок и без долгого внедрения западной MES» заменили на «без оплаты за каждую станцию в долларах и без долгого внедрения классической MES».
- Объём 2654 слова (был 2474), 16 FAQ, порядок полей, цены, slug, cases и related не менялись.

## Что не подтвердилось и убрано

- «В отзывах на ToolRadar критикуют Tulip, что он оправдан только у крупных клиентов»: это не отзывы, а редакционный текст ToolRadar; дословная фраза про «financially justifiable for larger» взята с getpulsesignal.com. Переформулировали.
- «Оплата за станцию по данным вендора» у Tulip и «подписка по данным вендора» у Katana и MRPeasy: страницы вендоров мы не открыли, поэтому атрибуция переведена на агрегаторы.
- «1С:УТ 11» как конфигурация для Казахстана: не подтвердили, заменили на «Управление торговлей для Казахстана».
- Katana «оплата за пользователя» (было в intro и FAQ общим списком): у Katana фиксированный тариф, исправлено.

## Открытые вопросы для Айдара

- Открыть вручную tulip.co/plans, mrpeasy.com/pricing, katanamrp.com/pricing и сверить цены; у агрегаторов они расходятся (особенно Katana: Core $299 против старой сетки $179-1 799).
- Какие конфигурации 1С реально у ваших клиентов (УНФ, ERP, УПП, Бухгалтерия)? От этого зависит, обещать ли OData: стандартный OData-интерфейс требует платформы 8.3, у старых УПП на обычных формах может понадобиться обмен файлами или COM. Мы написали «обмен файлами для старых конфигураций», проверьте, устраивает ли такая формулировка.
- Сроки прекращения поддержки УПП именно для Казахстана официально не нашли: пишем только про Россию.
- Реальные поисковые запросы (Wordstat или Google Keyword Planner по РК) не сняли из-за лимита поиска. Стоит проверить частоты: «учет производства», «программа для учета производства», «MES система», «учет производства в 1С», «как вести учет на производстве», и при необходимости подправить заголовки FAQ.
- Не проверено, предлагают ли местные вендоры MES-lite или «МойСклад» с производственными этапами в РК: если да, может стоить добавить честное сравнение с ними.
