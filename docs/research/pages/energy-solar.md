# energy-solar: заметка исследования

Дата: 2 ноября 2026. Ограничение: WebFetch к сайтам вендоров (safetyculture.com, getmaintainx.com) в этой сессии заблокирован сетью, а общий лимит веб-поиска закончился после 15 запросов. Поэтому часть цифр подтверждена через поисковые сводки и агрегаторы, а не через открытую страницу первоисточника. Это отмечено ниже.

## Что проверили

1. Западные аналоги в блоке compare: SafetyCulture, MaintainX, GOARC, плюс профильные для СЭС 3E SynaptiQ и Power Factors.
2. Цены SafetyCulture и MaintainX на 2026 год.
3. Цифру «минус 30% времени инспекций» у SafetyCulture.
4. Определение PR (performance ratio) по IEC 61724-1.
5. API порталов инверторов: Huawei FusionSolar, SolarEdge, Sungrow iSolarCloud.
6. ВИЭ в Казахстане: закон, доля в выработке, новые вводы.
7. Нормативка по наряду-допуску в электроустановках РК.
8. Термины glossary: СЭС, ВИЭ, инвертор, ППР, SCADA, КТП, PR, кВт·ч, PTW, CMMS. Расшифровки SCADA, CMMS, PTW, КТП верные, правок не потребовали.

## Источники

- SafetyCulture Premium $24 за место в месяц при оплате за год, $29 помесячно, есть бесплатный тариф: https://www.g2.com/products/safetyculturehq/pricing ; https://www.capterra.com/p/141080/iAuditor/pricing/ ; https://fieldservicesoftware.io/software/safetyculture/
- SafetyCulture, кейс Líder Aviação: на 30% меньше времени на инспекции флота, около R$80 000 в год экономии (именно реалы, а не доллары, как было в нашем report.md): https://safetyculture.com/customers/lider-aviacao (по поисковой сводке, страницу открыть не удалось)
- MaintainX: Basic бесплатно, Essential $20 (год) / $25 (месяц), Premium $65 / $75 за пользователя в месяц, Enterprise по запросу: https://maintainly.com/compare/maintainx ; https://facilio.com/blog/maintainx-pricing/ ; https://www.capterra.com/p/179296/GetMaintainx/pricing
- MaintainX, 10 мест Premium около $7 800 в год: https://infraspeak.com/en/compare/maintainx-review
- Power Factors Drive: модуль Field Service Management, наряды по событиям, планирование, запчасти, договорные обязательства O&M; клиенты Strata Solar, Miller Bros. Solar, MaxGen: https://powerfactors.com/?p=639 ; https://powerfactors.com/strata-solar-selects-power-factors/ ; https://www.solarpowerworldonline.com/2019/04/miller-bros-solar-signs-power-factors-for-om-software-assistance-on-1-3-gw-of-u-s-solar/ ; продуктовый лист https://powerfactors.com:443/wp-content/uploads/2022/01/PF_Product-Sheets-DriveOM.pdf
- 3E SynaptiQ: SaaS мониторинга и аналитики ВИЭ, модули Asset Operations и Solar Analytics, кейсы Sunrock (доступность инверторов) и IZEN (110 МВт·п): https://www.3e.eu/synaptiq ; https://www.casestudies.com/company/3e-4763/case-study/sunrock-keeps-inverter-availability-almost-at-100-with-3e ; https://www.casestudies.com/company/3e-4763/case-study/izen-monitors-110-mwp-solar-portfolio-with-3es-synaptiq
- Цены Power Factors и 3E SynaptiQ публично не найдены.
- PR по IEC 61724-1: PR = Yf / Yr, где Yf выработка на кВт паспортной мощности, Yr освещённость в плоскости панелей, делённая на эталонную 1 кВт/м²; PR зависит от температуры: https://hukseflux.com/uploads/inline/note-how_to_calculate_pv_power_plant_performance_ratio_and_performance_index_v1806.pdf ; https://www.sevensensor.com/how-to-calculate-the-performance-ratio-pr-of-a-pv-plant
- Huawei FusionSolar: SmartPVMS Northbound API (списки станций, устройств, исторические данные, аварии), лимиты запросов зависят от числа станций и устройств у пользователя: https://github.com/tijsverkoyen/HomeAssistant-FusionSolar/files/15312165/SmartPVMS.24.2.0.Northbound.API.Reference.pdf ; https://kb.solytic.com/en/knowledge/set-up-api-key-huawei-fusionsolar
- SolarEdge Monitoring API: около 300 запросов в сутки на ключ аккаунта и отдельно на станцию, при превышении HTTP 429; рекомендуемый опрос не чаще раза в 15 минут (по вторичным источникам, цитирующим официальный PDF): https://pypi.org/project/solaredge/2.0.0/ ; https://raw.githubusercontent.com/api-evangelist/solar-edge/refs/heads/main/rate-limits/solar-edge-rate-limits.yml
- Sungrow iSolarCloud: OpenAPI через developer portal с OAuth2, данные станций обновляются раз в 5 минут; есть ли аварии в API, не подтверждено: https://pypi.org/project/pysolarcloud/
- ВИЭ в РК, итоги 2025: 8,6 млрд кВт·ч, около 7% выработки (6,43% в 2024), введено 9 объектов на 503 МВт, из них 3 СЭС на 90 МВт; цель 15% к 2030 году: https://kapital.kz/economic/143877/v-2025-godu-v-kazahstane-vveli-v-ekspluataciyu-devyat-novyh-obuektov-vie.html ; https://kazpravda.kz/n/polgigavatta-zelenoy-energii-9-proektov-vie-v-2025-godu-vnedrili-v-kazahstane/ ; https://bizmedia.kz/2026-05-06-v-kazahstane-vyroslo-proizvodstvo-zelyonoj-energii/
- Закон РК от 4 июля 2009 года № 165-IV «О поддержке использования возобновляемых источников энергии», аукционы и PPA с РФЦ: https://adilet.zan.kz/rus/docs/Z090000165_ ; https://kpmg.com/kz/ru/home/insights/2024/07/legal-alert.html
- Правила техники безопасности при эксплуатации электроустановок потребителей, приказ Министра энергетики РК от 19 марта 2015 года № 222 (рег. № 10889), с изменениями 2021 года: https://adilet.zan.kz/rus/docs/V1500010889 ; Правила технической эксплуатации электроустановок потребителей, приказ № 246 от 30 марта 2015 года: https://adilet.zan.kz/rus/docs/V1500010949

## Что исправили на странице

- compare: заменили GOARC на профильные для СЭС платформы Power Factors (Drive) и 3E SynaptiQ, переписали вступление про два слоя ПО (управление активами ВИЭ и мобильные обходы/ТО). Цены у обоих «не опубликована, по запросу».
- compare, SafetyCulture: уточнили, что 30% из кейса авиакомпании Líder Aviação, цену дали как Premium $24 за место в месяц при оплате за год со ссылкой на G2 и Capterra.
- compare, MaintainX: вместо «$16-75» актуальные тарифы 2026 года Essential $20 и Premium $65 при оплате за год, 10 мест Premium около $7 800 в год. Пересчёт в тенге (3,9 млн ₸) убрали, он зависел от курса.
- compare, строка aidardev: добавили чтение аварий из портала инверторов.
- integrations: строку «выгрузки SCADA и порталов» разделили на порталы инверторов (Huawei FusionSolar, SolarEdge, Sungrow iSolarCloud) и выгрузки SCADA (CSV, Modbus TCP, OPC UA).
- features: пункт «авария из портала инверторов создаёт черновик наряда, если у портала открыт API».
- glossary PR и FAQ про PR: определение по IEC 61724-1 (выработка против той, что дала бы паспортная мощность при измеренной освещённости), оговорка про жару и сравнение по сезону.
- FAQ про SCADA переформулирован под реальный запрос: «Можно подключить мониторинг Huawei FusionSolar или SolarEdge?», с названиями API и лимитом SolarEdge около 300 запросов в сутки.
- glossary ВИЭ и FAQ «Что такое СЭС и ВИЭ»: контекст РК, закон 2009 года и около 7% выработки в 2025 году по данным Минэнерго.
- FAQ про электронный наряд-допуск: ссылка на Правила ТБ при эксплуатации электроустановок потребителей (приказ № 222) как контекст, допустимость электронной подписи согласуется со службой ОТ.
- FAQ сравнения: «Чем это отличается от MaintainX, SafetyCulture или Power Factors?».
- Чтобы удержать объём около 2600 слов, слегка сократили несколько FAQ и сценариев без потери смысла.

## Что не подтвердилось и убрано

- GOARC и «наряд быстрее на 60%» (кейс Delek US у Verdantix): цифра есть в нашем field_safety.md, но вендор не профильный для СЭС, а страницу Verdantix (клиентский портал) открыть нельзя. Убрали вместе со строкой.
- «$16-75 за пользователя»: устаревший диапазон, заменён тарифами 2026 года.
- «От $0, платные тарифы от $24 в месяц»: формулировка без «за место» вводила в заблуждение, уточнили.
- 25 ГВт подключённых активов у 3E SynaptiQ встречается в сводке без ясного первоисточника, на страницу не брали.
- 200+ типовых работ в библиотеке Power Factors есть в продуктовом листе вендора 2022 года, но для экономии объёма не взяли.
- Типичный «хороший» PR 75-85% или выше 80% в первоисточнике стандарта не найден, цифру на страницу не ставили.

## Открытые вопросы для Айдара

- Какие инверторы реально стоят у потенциальных клиентов в РК (Huawei, Sungrow, SolarEdge, другие)? От этого зависит, какой портал подключать первым. Alarm API Sungrow не подтверждён.
- У Huawei FusionSolar Northbound-аккаунт создаёт владелец станции или установщик; кто это будет делать у клиента и даст ли он доступ?
- Точное число объектов ВИЭ в РК в 2026 году: в поиске мелькали «169 объектов, 3 749,62 МВт на 2 квартал 2026» со ссылкой на сайт Минэнерго (gov.kz/memleket/entities/energo/activities/4910), но открыть страницу не удалось, на сайт не ставили.
- Допустимость электронного наряда-допуска с ЭЦП по приказу № 222 в редакции 2026 года мы не проверяли юридически. Стоит уточнить у знакомого инженера по ОТ или юриста.
- Нужна ли на странице строка про калькулятор окупаемости с учётом закона о ВИЭ (нетто-потребители, продажа излишков)? Нормы про нетто-потребителей в поиске видны фрагментарно, мы их не трогали.
- Цены SafetyCulture и MaintainX взяты у агрегаторов; при доступе к сайтам вендоров стоит сверить напрямую.
