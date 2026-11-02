# Shop-floor and operations IT/AI solutions deployed by Western manufacturers, 2024-2026

Scope note: research done 02.11.2026 with ~16 web searches (no full-page fetches; findings come from search-result summaries of the pages linked). Almost all customer numbers are vendor-published or vendor-commissioned (Forrester TEI). Treat them as upper-bound marketing figures, not audited results. Prices are mostly from third-party aggregators (Capterra, TrustRadius, ToolRadar etc.) because most vendors quote privately; aggregators often conflict, conflicts are noted.

## 1. Computer-vision quality inspection (Landing AI, Instrumental, Elementary, Cognex ViDi / In-Sight)

### Takeaway
AI visual inspection is a mature, widely bought category; hardware entry point is a single smart camera at roughly $2.5-4.5k (Cognex In-Sight 2800, unofficial prices), software is SaaS with free/low tiers (LandingLens) up to quote-only enterprise. Published results are mostly qualitative ("fewer escapes", "10x fewer false positives") rather than audited ROI.

### Cited Findings
- Cognex In-Sight 2800 (camera + light + deep-learning "ViDi EL Classify" in one box) launched April 2022; Cognex says it can be trained "with just a few images"; targets presence/absence checks, sorting/classification, character reading — [Automation World](https://www.automationworld.com/supplier-news/news/22172114/cognex-corporation-cognex-in-sight-2800-combines-deep-learning-and-traditional-vision-in-an-easy-to-use-package); main target segments automotive parts, electronics (component presence, connector mating), logistics/packaging — [EE Times Japan](https://eetimes.itmedia.co.jp/ee/spv/2204/05/news104_2.html)
- In-Sight 2800 price: no official list price; eBay reseller lists new IS2801M at $2,490 — [eBay](https://www.ebay.com/p/2331666862); Robotomated cites MSRP $4,500 (unverified page) — [Robotomated](https://robotomated.com/explore/manufacturing/cognex-insight-2800); distributors quote on request — [Keepital](https://keepital.com/company/sg/takeiki-pte-ltd/product/cognex-in-sight-2800)
- LandingLens (Landing AI) pricing is inconsistent across aggregators: "from $39", "$250/month", free Basic tier + quote-based Enterprise — [SoftwareFinder](https://softwarefinder.com/artificial-intelligence/landinglens); [Techjockey](https://techjockey.com/detail/landing-ai); [Fitgap](https://us.fitgap.com/products/042908/landing-ai)
- Landing AI result claim: in a sheet-metal stamping inspection the system reduced false positives ~10x vs human inspection (Frost & Sullivan award write-up, vendor-friendly, 2020) — [Frost & Sullivan PDF](https://www.frost.com/wp-content/uploads/2020/11/LandingAI-Award-Write-up.pdf)
- VERISTA deployed and validated a Landing AI-based CV inspection at a "top 5 global medical device manufacturer" (July 2025), reporting improved quality and fewer error escapes (no numbers in summary) — [ManufacturingTomorrow](https://www.manufacturingtomorrow.com/news/2025/07/17/verista-top-5-global-medical-device-manufacturer-implements-validates-computer-vision-solution-in-record-speed/25408)
- Elementary (LA): $12.7M Series A 2020, $30M Series B Dec 2021 (Tiger Global), strategic investment from Rockwell Automation in 2024 (undisclosed) with Toyota Ventures; customers include Toyota Indiana plant; claimed 250M+ inspections (2021) — [PR Newswire](https://prnewswire.com/news-releases/elementary-raises-30m-series-b-led-by-tiger-global-for-its-ai-vision-platform-for-manufacturing-301446614.html); [Photonics.com](https://photonics.com/Articles/Elementary_Secures_Rockwell_Investment_for_AI/a70028)
- Source note: one secondary essay argues vision QC is usually where manufacturers spend AI budget first and "modern computer vision systems work with hundreds of good examples", i.e. needs less historical data than predictive maintenance (opinion) — [Amit Kothari](https://amitkoth.com/manufacturing-ai-applications/)

### Inferences
- Minimum infrastructure: one industrial or even good IP/USB camera per station, fixed lighting, a trigger (sensor/PLC signal), a few hundred labelled good/bad images, an edge PC or smart camera, plus a reject signal or operator alert. Lighting and fixturing, not the model, usually decide success.
- For a small studio: realistic offer is a "station" package (camera + edge box + cloud dashboard + Telegram/WhatsApp alert on defect + defect photo log), using open models or LandingLens-type SaaS; Cognex-style smart cameras are the "buy" alternative to compare against on price.

### Gaps
- Instrumental (electronics assembly inspection): no 2024-2026 pricing or measured customer result found in this pass.
- No audited ROI or price list for Landing AI enterprise, Elementary or Cognex ViDi software licenses.

## 2. Predictive maintenance / condition monitoring (Augury, Tractian, Senseye/Siemens, Samotics)

### Takeaway
The most "proven" AI category with the biggest published ROI numbers: wireless vibration/temperature sensors plus a SaaS subscription, priced per monitored point (around $35/sensor/month cited for Tractian). Vendor case studies claim 300-800% ROI and paybacks of 3-6 months, but all are vendor-produced and figures sometimes conflict even for the same customer. Overall adoption is still low (~18-27% of maintenance teams).

### Cited Findings
- Augury (Forrester TEI, July 2025, commissioned by Augury): composite US manufacturer with $20B revenue, 310% 3-year ROI, $20.1M NPV, $16.8M saved over 3 years from reduced unplanned downtime, payback <6 months, maintenance spend -15% — [Business Wire](https://www.businesswire.com/news/home/20250910685481/en/Augurys-Solutions-Delivered-310-3-Year-Return-According-to-Independent-Research); [Forrester TEI](https://tei.forrester.com/go/Augury/Machine-and-Process-Health/?lang=en-us)
- PepsiCo/Frito-Lay: piloted Augury in 4 Frito-Lay plants, then rolled out to many US Frito-Lay plants; PepsiCo Labs quote: after a year the pilot plants had "zero breakdowns, interruptions or incremental costs" (vendor-published) — [Augury blog](https://www.augury.com/blog/watch-how-augury-helped-frito-lay-save-a-mountain-of-snacks/); [casestudies.com](https://www.casestudies.com/company/augury/case-study/pepsicos-focus-on-roi-based-innovation-leads-to-decreased-machine-downtime)
- Augury building-materials customer: pilot on 125 machines at 2 sites, then rapid expansion — [casestudies.com](https://www.casestudies.com/company/augury/case-study/americas-leading-building-materials-manufacturer-achieves-fast-time-to-value-with-machine-health)
- Tractian vendor cases: Johnson Controls $2.6M savings across facilities in <12 months — [Tractian](https://tractian.com/en/case-studies/johnson-controls); CP Kelco $483K savings / 787% ROI per casestudies.com, but Tractian's own page says $432K / +297% (conflict) — [casestudies.com](https://www.casestudies.com/company/tractian/case-study/results-and-impact-report-of-tractian-solutions-on-cp-kelco); SWARCO $420K savings, 468% ROI in 12 months — [Tractian PDF](https://tractian-webpage.s3.amazonaws.com/cases/en/US-CaseStudies-Swarco.pdf); large pulp & paper producer $3.3M saved, payback ~3 months — [casestudies.com](https://www.casestudies.com/company/tractian/case-study/large-pulp-and-paper-producer-customer-case-study); "America's largest aluminum producer" 480% ROI, payback 6 months — [casestudies.com](https://www.casestudies.com/company/tractian/case-study/americas-large-aluminum-producer-customer-case-study)
- Tractian aggregate marketing claims: -43% unplanned downtime, -36% parts inventory cost — [Tractian](https://tractian.com/en/solutions/apm/predictive-maintenance-software); NVIDIA case study cites 6x-12x ROI and ~$6,000 annual savings per monitored machine — [NVIDIA](https://www.nvidia.com/en-in/case-studies/tractian/)
- Tractian pricing: not published; ~$35/month per installed sensor (aggregator estimate) — [Zoftware Hub](https://zoftwarehub.com/products/tractian/pricing); Capterra shows condition monitoring and OEE plans as custom quotes, usage-based — [Capterra](https://www.capterra.com/p/230505/Tractian/pricing); Sacra says quotes are based on asset risk, not just sensor count — [Sacra](https://sacra.com/chat/h/b5456823-b955-4bfc-8cf6-21fe680a60af/); CMMS seats ~$50-60/user/month (5-user minimum per Fitgap) — [ITQlick](https://www.itqlick.com/tractian/pricing); [Fitgap](https://us.fitgap.com/products/tractian); Tractian also sells "Energy Trac" energy sensor and per-monitored-point "Smart Trac Ultra" — [Tractian plans](https://tractian.com/planos)
- Adoption/barriers: Fluke survey (via aggregator) says PdM adoption doubled to 18%, 78% cite workforce skills shortage as primary obstacle — [Rallies.ai summary of Fluke](https://rallies.ai/news/fluke-survey-predictive-maintenance-adoption-doubles-to-18-firms-allocate-up-to-30-budgets); 2025 peer-reviewed review: data quality, computation load and implementation cost remain major barriers — [Frontiers in Mech. Eng. 2025](https://www.frontiersin.org/journals/mechanical-engineering/articles/10.3389/fmech.2025.1722114/full); vendor page claims 72% cite data quality as top barrier and 60-70% of PdM projects fail to scale (unsourced) — [iFactory](https://ifactoryapp.com/predictive-maintenance/overcoming-predictive-maintenance-implementation-challenges)

### Inferences
- Minimum infrastructure: wireless vibration/temperature sensors (bolt or magnet mount), a gateway (LTE/Wi-Fi), list of critical rotating assets (motors, pumps, fans, compressors, gearboxes); no historical failure data required when the vendor ships pre-trained models, which is the key selling point of Augury/Tractian.
- Building the analytics from scratch is hard for a small studio (failure-mode models need large labelled fleets). More plausible: resell/integrate an existing sensor platform, or build the "last mile" (alerts to Telegram/WhatsApp, work orders, CMMS-lite, reports) on top of cheaper sensors.

### Gaps
- Senseye (Siemens) and Samotics: no 2024-2026 pricing or quantified cases collected in this pass.
- No independent (non-vendor) ROI study found; Forrester TEI is vendor-commissioned.

## 3. MES-lite, digital work instructions, production tracking, MRP for SMB (Tulip, Katana, MRPeasy, Fusion Operations/Prodsmart, Amper)

### Takeaway
This is the most SMB-accessible category: transparent SaaS pricing from ~$49/user/month (MRPeasy) or ~$299/month flat (Katana) up to ~$100-250 per station/month (Tulip) and ~$2,000/user/year (Fusion Operations). Results claimed are cycle-time and rework reductions of 30-60% on specific processes.

### Cited Findings
- Tulip prices per "interface" (station/device running Tulip), not per user — [ToolRadar](https://toolradar.com/tools/tulip/pricing); Essentials ~$100/interface/month, Professional ~$250/interface/month — [ToolRadar](https://toolradar.com/tools/tulip/pricing); ERP Research cites 10-interface minimum at $100/interface/month billed annually — [ERP Research](https://erpresearch.com/erp-add-ons/manufacturing-mes-plm/tulip/pricing); TrustRadius instead lists $1,200/year/interface (5 minimum) Essentials and $2,400/year/interface (10 minimum) Professional (conflict) — [TrustRadius](https://www.trustradius.com/compare-products/operations1-vs-tulip-interfaces)
- Tulip vendor cases: medical device maker built "next-gen MES at one-third the cost" — [casestudies.com](https://www.casestudies.com/company/tulip-interfaces/case-study/medical-device-manufacturer-implements-a-next-gen-mes-at-a-third-of-the-cost); Sharp Packaging clinical packaging 30% faster — [casestudies.com](https://www.casestudies.com/company/tulip-interfaces/case-study/sharp-packagings-clinical-packaging-process-is-30-faster-with-tulip); TICO Tractors cut quality inspection and rework time by 60% — [casestudies.com](https://www.casestudies.com/company/tulip-interfaces/case-study/tico-tractors-reduced-quality-inspection-and-rework-time-by-60); Reframe Systems builds homes 2.5x faster — [casestudies.com](https://www.casestudies.com/company/tulip-interfaces/case-study/reframe-systems-builds-homes-25x-faster-with-tulip); Forrester TEI commissioned by Tulip: $318,750 saved by consolidating processes — [IIoT World](https://www.iiot-world.com/?p=34027)
- Critique: per-interface cost escalates for growing operations; Tulip "only financially justifiable for larger" environments — [ToolRadar](https://toolradar.com/tools/tulip/pricing); [getpulsesignal](https://getpulsesignal.com/compare/textexpander-vs-tulip)
- MRPeasy: from $49/user/month (MRPeasy's own page); after first 10 users, +10 seats for fixed $79/month — [MRPeasy](https://www.mrpeasy.com/mrpeasy-vs-katana); tiers $49 / $69 / $99 / $149 per user/month, no contract, 30-day trial — [CostBench](https://www.costbench.com/compare/mrpeasy-vs-katana/); [SpotSaaS](https://www.spotsaas.com/blog/mrpeasy-pricing)
- Katana: flat-rate with unlimited users, Core ~$299/month — [Craftybase](https://craftybase.com/compare/katana-vs-mrpeasy); other sources say $0-299 or $399/month (conflict) — [CostBench](https://costbench.com/compare/katana-vs-mrpeasy/); [Listicler](https://listicler.com/blog/mrpeasy-vs-katana-cloud-mrp-small-batch-makers)
- Autodesk Fusion Operations (ex-Prodsmart), cloud MES for shop-floor tracking: ~$2,000/user/year per Capterra/GetApp/TrustRadius; Autodesk sells via resellers, no public price — [Capterra](https://www.capterra.co.uk/software/153796/Fusion-Operations); [TrustRadius](https://www.trustradius.com/compare-products/autodesk-fusion-operations-vs-tulip-interfaces); [Frontdesk Review](https://frontdeskreview.com/software/mrp-software/autodesk-fusion-operations/)
- Amper (machine monitoring): current sensor clips onto a machine's power supply, infers run state from current, ~10 min install, no PLC integration; free 30-day pilot on 2 machines; no public price — [Amper trial page](https://resources.amper.xyz/oee-tracking-software-trial); [Amper machine monitoring trial](https://resources.amper.xyz/machine-monitoring-software-trial)
- Amper customer: Mitotec saved ~$1.4M in 11 months from downtime reduction via OEE tracking (calculation not shown) — [Production Machining](https://pm.mydigitalpublication.com/november-2024/page-32); Destaco reduced unplanned downtime, improved throughput (no %) — [ECI case study](https://www.ecisolutions.com/resources/case-study/destaco/); vendor claim 50% productivity gain in 30 days (no methodology) — [yespress.io](https://yespress.io/amper-technologies); reportedly acquired by ECI Software Solutions in Dec 2025 (secondary source; consistent with ECI hosting the Destaco Amper case) — [Supergood](https://supergood.ai/api-report-card/amper-eci-software-solutions)

### Inferences
- Minimum infrastructure: tablets/kiosks at stations, Wi-Fi, a product/routing/BOM list; for Amper-style monitoring only a current clamp + gateway per machine. No PLC/ERP integration needed to start.
- This is the strongest fit for a small web/mobile studio: production tracking app (work orders, operator check-in by QR, scrap/downtime reasons, photo-based work instructions), combined with cheap current-clamp IoT for run/idle status, and Telegram/WhatsApp shift reports. Western reference pricing ($49/user, $100-250/station, $2k/user/year) gives a benchmark to price against.

### Gaps
- No independent adoption statistics for Tulip/Katana/MRPeasy customer counts in this pass.
- Amper list price unknown.

## 4. Production scheduling / optimization (PlanetTogether, AI schedulers)

### Takeaway
APS tools for SMB are quote-based, roughly $750-1,500/month starting points from aggregators; no independent evidence of "AI scheduling" results for small manufacturers was found; outcome numbers are sparse vendor testimonials.

### Cited Findings
- PlanetTogether pricing: "from $1,500/month" with free trial (SourceForge) vs "from $750" (FitGap) — conflict — [SourceForge](https://sourceforge.net/software/product/PlanetTogether); [FitGap](https://us.fitgap.com/products/planettogether); official page says pricing scales and offers small-business/education/perpetual programs on request — [PlanetTogether](https://planettogether.com/pricing)
- Pricing in practice quote-only, depends on plants, users, integration scope; vendor offers proof of concept on customer data before purchase — [NextMSC](https://www.nextmsc.com/blogs/4-manufacturing-scheduling-software-that-handles-machine-capacity-and-maintenance-at-a-glance)
- Reviews: pricing requires consultation, dashboards "dated" — [SoftwareConnect](https://softwareconnect.com/job-shop/planettogether); the one concrete outcome found is a vendor testimonial of a medical device company cutting inventory costs by 15% — [PlanetTogether blog](https://www.planettogether.com/blog/topic/cost-reduction/page/6)

### Inferences
- Minimum data: clean routings, machine capacities, setup times, open orders; most SMBs lack these in structured form, which is why MES-lite/MRP usually comes before scheduling.
- A small studio could deliver a "visual scheduler" (drag-and-drop Gantt over orders + simple heuristics or an OR-Tools optimizer) as a module of a tracking app rather than a standalone AI product.

### Gaps
- Fabrico and newer AI-native schedulers: not researched (search budget). No independent scheduling ROI study found.

## 5. Energy monitoring and optimization for plants

### Takeaway
Submetering + dashboards commonly claim 15-20% electricity savings for SMB plants, but the evidence is vendor/blog-grade; the best-documented case (Saint-Gobain via DOE Better Buildings) shows ~15% from visualization. Hardware is cheap (CT clamps + gateway); value comes from turning data into actions.

### Cited Findings
- Saint-Gobain Soddy-Daisy site: wireless submetering + dashboard, four sub-projects ~15% annual electricity savings (date pre-2025) — [Smart Energy Decisions](https://www.smartenergydecisions.com/?p=16536)
- Blog-level claims: mid-sized Illinois plant ~$100k/year from IoT monitoring of top 5 energy consumers (anecdotal, no source) — [blog](https://techsuno2.blogspot.com/2025/05/saving-100k-year-how-factory-optimized.html); SMB guide claims 15-20% savings, ~$13k first-year saving, ~3-month payback (no data shown) — [Breeze Direct](https://breezedirect.pages.dev/blog/2026-02-20-energy-monitoring-small-manufacturers-power-savings); vendor claims 15-25% from AI coordination — [iFactory](https://ifactoryapp.com/blog/ai-factory-energy-intelligence-cost-savings-2026)
- LBNL: collecting data is not the challenge; collecting data that leads to actionable savings is — [LBNL](https://eta.lbl.gov/publications/conducting-metering-assessment)
- Rockwell also publishes an energy-monitoring visibility case (details not extracted) — [Rockwell](https://www.rockwellautomation.com/en-us/company/news/case-studies/energy-monitoring-system-improves-visibility.html)
- Tractian sells an "Energy Trac" sensor alongside vibration sensors — [Tractian plans](https://tractian.com/planos)

### Inferences
- Same hardware as machine-status monitoring (current clamps) can produce both OEE (run/idle) and kWh per machine/shift: a natural bundle for a small studio.
- Savings depend on tariff structure and on someone acting (shutting idle compressors, shifting loads); a weekly bot report with "top 5 waste items" is the deliverable, not the dashboard.

### Gaps
- No rigorous 2024-2026 utility/DOE evaluation of SMB submetering savings found.

## 6. Low-cost IIoT retrofits, OEE dashboards and digital twins for SMB

### Takeaway
Retrofitting old machines with clip-on current sensors to get run/idle/OEE is a proven, cheap entry point (Amper: 10-minute install, no PLC); vendors offer free 2-machine pilots. "Digital twin" for SMB in practice means a live OEE/status dashboard, not a physics simulation.

### Cited Findings
- Amper: current-sensor clip-on, ~10 min install, no PLC integration; free 2-machine, 4-week pilot — [Amper](https://resources.amper.xyz/oee-tracking-software-trial)
- Mitotec ~$1.4M saved in 11 months via OEE tracking (Amper) — [Production Machining Nov 2024](https://pm.mydigitalpublication.com/november-2024/page-32); MoldMaking Technology video on OEE tracking reducing downtime — [MoldMaking Technology](https://moldmakingtechnology.com/articles/video-innovative-oee-tracking-system-reveals-machine-data-to-reduce-downtime)
- Tractian bundles OEE plans with condition monitoring (custom quote) — [Capterra](https://www.capterra.com/p/230505/Tractian/pricing)
- WEF Lighthouse example of large-scale twin use: Carl Zeiss Vision Guangzhou deployed 30+ use cases combining IIoT, genAI, ML and digital twin (not Western, flagship scale) — [WEF / SUFE newsletter](https://academicnewsletter.sufe.edu.cn/info/461800)

### Inferences
- Minimum: one current clamp per machine (or a stack-light tap), a gateway, Wi-Fi/LTE, an operator tablet for downtime reasons. Data value grows when downtime reasons are captured by operators, which is a UX/app problem, i.e. a studio's strength.

### Gaps
- No SMB-specific digital-twin products with prices/cases found; hardware BOM costs for current-clamp kits not collected.

## 7. Generative AI copilots on the shop floor (Siemens Industrial Copilot, Rockwell/Microsoft, LLM over manuals and maintenance history)

### Takeaway
GenAI on the shop floor is real but early: Siemens reports 100+ customers and named deployments (thyssenkrupp, Siemens Erlangen), Rockwell ships a PLC-code copilot, and CMMS vendors (MaintainX) ship LLM assistants over OEM manuals and work-order history; however, quantified, independently verified results are essentially absent, and genAI was only 9% of top Lighthouse use cases in the Jan 2025 WEF cohort.

### Cited Findings
- Siemens + Microsoft (Oct 2024): Industrial Copilot used by 100+ customers in Europe and US; thyssenkrupp Automation Engineering to roll it out globally for machine engineering from 2025; used in battery quality inspection equipment for EV parts — [Microsoft News](https://news.microsoft.com/2024/10/24/siemens-and-microsoft-scale-industrial-ai/); [thyssenkrupp](https://www.thyssenkrupp-automotive-technology.com/de/press-detail/siemens-und-microsoft-setzen-auf-ki-skalierung-thyssenkrupp-automation-engineering-plant-globalen-rollout-des-copiloten-ab-2025-288188)
- Engineer reach figure conflicts: Spanish Siemens release "12,000+ engineers" vs Italian release "120,000+" — [Siemens ES PDF](https://assets.new.siemens.com/siemens/assets/api/uuid:ba604ff7-4db2-4eef-be33-7296ad0b2d5e/Siemens-y-Microsoft-escalan-la-IA-industrial.pdf); [Siemens IT PDF](https://assets.new.siemens.com/siemens/assets/api/uuid:1ce04123-c5dd-4b41-b5d8-a992974962c0/20241104-comunicato-stampa-Siemens-e-Microsoft-Industrial-Copilot.pdf)
- Siemens edge-based Operations Copilot rolled out on soldering machines at Siemens Erlangen electronics factory to help operators interpret errors — [Manufacturing.net](https://www.manufacturing.net/operations/news/22926249/siemens-expands-generative-aipowered-industrial-copilot); Siemens added a genAI maintenance offering and later AI agents — [I-Connect007](https://iconnect007.com/article/144587/siemens-expands-industrial-copilot-with-new-generative-aipowered-maintenance-offering/144584/smt); [Plant Automation Technology](https://www.plantautomation-technology.com/technology-exclusives/press-releases/siemens-introduces-ai-agents-for-industrial-automation); "~25% reduction in reactive maintenance time" in pilots appears only on a market-research page, not a Siemens primary source — [Evolvance](https://evolvancemarketresearch.com/reports/industrial-copilot-market/)
- Rockwell FactoryTalk Design Studio Copilot (Azure OpenAI) generates PLC code from natural language; Rockwell's own docs warn it "may display inaccurate information"; no named customer results published — [Pack World](https://www.packworld.com/trends/digital-transformation/article/22927841/rockwell-automations-factorytalk-design-studio-adds-generative-ai-copilot); [Rockwell docs](https://www.rockwellautomation.com/en-us/docs/factorytalk-design-studio/current/contents-ditamap/factorytalk-design-studio-help/before-you-begin/factorytalk-design-studio-copilot.html)
- MaintainX CoPilot (Feb 2025): LLM assistant (Anthropic and OpenAI models) over OEM manuals + company work-order history, mobile, 24/7; June 2025 added photo-based diagnosis and voice-note summaries; no quantified customer outcomes found — [Robotics 24/7](https://www.robotics247.com/article/promat_2025_maintainx_reimagines_maintenance_to_help_manufacturers_thrive); [MaintainX June 2025](https://webflow.getmaintainx.com/blog/whats-new-at-maintainx-june-2025)
- WEF Global Lighthouse Network Jan 2025 cohort (17 new sites, 189 total): 77% of top-5 use cases enabled by analytical AI, 9% by genAI — [WEF](https://www.weforum.org/press/2025/01/global-lighthouse-network-2025-world-economic-forum-recognizes-companies-transforming-manufacturing-through-innovation/); Sept 2025 cohort (12 sites, 201 total): AI+genAI enable "up to 50%" of top use cases; GlobalFoundries Fab 7 uses genAI-enabled maintenance — [WEF](https://www.weforum.org/press/2025/09/global-lighthouse-network-2025-world-economic-forum-recognizes-12-new-sites-driving-holistic-transformation-in-manufacturing/); McKinsey says 36 new sites in 2025 (conflicts with WEF's 29) — [McKinsey](https://www.mckinsey.com/capabilities/operations/our-insights/the-continuing-evolution-of-the-global-lighthouse-network)

### Inferences
- The pattern copied by everyone (Siemens, MaintainX) is "RAG over manuals + maintenance history + photo/voice input on a phone". This is exactly buildable by a small studio with an LLM API: a Telegram/WhatsApp bot that answers technicians from the plant's manuals, logs breakdowns by voice, and summarizes shifts. Minimum data: PDFs of OEM manuals, any existing breakdown log (even Excel), and staff phones.
- Risk to state in sales: vendors themselves warn about inaccurate answers; position as assistant with sources cited, not autonomous.

### Gaps
- No independently measured productivity effect for any shop-floor genAI copilot found. Siemens Industrial Copilot pricing not found.

## 8. What failed or has low adoption, and why

### Takeaway
Most manufacturers are still stuck between pilot and scale: depending on survey, only 10-29% have AI deployed at scale; PdM adoption ~18-27%. Main reasons cited are data quality/accessibility, skills shortages, integration with legacy systems and per-seat/per-station costs that escalate.

### Cited Findings
- McKinsey State of AI 2025: cross-industry only ~1/3 have begun to scale AI and 7% fully scaled; manufacturing share rolling out beyond pilots rose from 4% (2024) to 14% (2025) (via food-industry summary) — [Food Industry Executive](https://foodindustryexecutive.com/?p=29043)
- Deloitte 2025 Smart Manufacturing survey (600 US execs): only 29% have deployed AI/ML at scale across facilities — [Reliamag summary](https://reliamag.com/topics/guides/ai-manufacturing-adoption-rates); Deloitte AI in Manufacturing 2026 (Germany, 140+ firms): 84% get measurable value, but only 20% of use cases are scaled — [Deloitte DE](https://www.deloitte.com/de/de/Industries/industrial-construction/research/ai-in-manufacturing)
- Augury/IndustryWeek State of Production Health: 2025 edition (500 execs, March 2025) 3x more companies beyond "pilot purgatory" vs 2024; 2026 edition: share scaling over half of AI pilots 14% (2025) to 42% (2026) (vendor-sponsored) — [Augury](https://www.augury.com/collateral/the-state-of-production-health-2026/); [IoT For All](https://www.iotforall.com/ai-industry-production-health-2025)
- Parsec survey (1,200 leaders, vendor): 72% adopted AI in some form, 10% at scale — [LetsDataScience](https://letsdatascience.com/news/parsec-survey-finds-a-wide-gap-between-manufacturing-ai-pilo-12112f67)
- Why pilots stall (WWT/Industry Today) — [WWT](https://www.wwt.com/news/industry-today-why-ai-pilots-stall-in-manufacturing)
- PdM barriers: workforce skills (78%, Fluke via aggregator) — [Rallies.ai](https://rallies.ai/news/fluke-survey-predictive-maintenance-adoption-doubles-to-18-firms-allocate-up-to-30-budgets); data quality, compute and implementation cost — [Frontiers 2025](https://www.frontiersin.org/journals/mechanical-engineering/articles/10.3389/fmech.2025.1722114/full); PdM needs sensors on every machine, failure history you don't have, and integration with systems not designed to talk (opinion) — [Amit Kothari](https://amitkoth.com/manufacturing-ai-applications/)
- Cost escalation critique for per-interface MES (Tulip) — [ToolRadar](https://toolradar.com/tools/tulip/pricing); Fusion Operations reviewers flag it as expensive for some teams — [RFP.wiki](https://www.rfp.wiki/vendors/proshop-erp/autodesk-fusion-operations)
- Energy: data collection is easy, turning it into action is the hard part — [LBNL](https://eta.lbl.gov/publications/conducting-metering-assessment)

### Inferences
- Failure pattern: buying "AI" before having basic digital data (orders, downtime reasons, asset lists). Products that win with SMB create the data first (tracking apps, clip-on sensors) and give a visible weekly result.
- For a small studio, sell a 4-8 week paid pilot on 2-5 machines/stations with one measured KPI (downtime hours, scrap %, kWh), copying the Amper/PlanetTogether/Augury pilot playbook.

### Gaps
- Survey definitions of "scaled" differ and several are vendor-sponsored; no BCG manufacturing-AI survey figure found. No documented named failure case (vendor exit, cancelled rollout) found in this pass.

## Summary catalogue for the report writer (all numbers sourced above)

| # | Solution type | Example vendors | Typical price model (as found) | Claimed effects | Minimum data/infra | Small-studio fit |
|---|---|---|---|---|---|---|
| 1 | CV quality inspection | Cognex In-Sight 2800, LandingLens, Elementary | Smart camera ~$2.5-4.5k (unofficial); SaaS free tier to quote | ~10x fewer false positives (Landing AI, 2020); fewer escapes (VERISTA 2025) | Camera, lighting, trigger, few hundred labelled images | Medium: build station app + alerts, use off-the-shelf model/camera |
| 2 | Predictive maintenance | Augury, Tractian | ~$35/sensor/month est.; custom quotes | 310% ROI, <6 mo payback (Forrester for Augury); 300-800% ROI vendor cases (Tractian) | Wireless vibration sensors + gateway on critical rotating assets | Low for analytics, high for resell + alerts/CMMS layer |
| 3 | MES-lite / work instructions | Tulip, Fusion Operations | $100-250/station/month; ~$2k/user/year | 30% faster packaging, -60% inspection/rework time (Tulip cases) | Tablets, Wi-Fi, routings | High |
| 4 | Cloud MRP for SMB | MRPeasy, Katana | $49-149/user/month; ~$299/month flat | (no measured outcomes collected) | BOMs, stock, orders | High (local alternative/integration) |
| 5 | Machine monitoring / OEE retrofit | Amper (ECI), Tractian OEE | Free 2-machine pilot; quote | Mitotec ~$1.4M saved in 11 months | Current clamp + gateway per machine | High |
| 6 | Production scheduling (APS) | PlanetTogether | ~$750-1,500/month start (conflicting) | -15% inventory cost (vendor testimonial) | Routings, capacities, setup times, orders | Medium (Gantt module + optimizer) |
| 7 | Energy monitoring | Tractian Energy Trac, Rockwell, submetering | Hardware + SaaS, not priced here | ~15% electricity (Saint-Gobain); 15-20% (blog/vendor) | CT clamps per circuit, tariff data | High (bundle with OEE) |
| 8 | GenAI copilots / LLM over manuals | Siemens Industrial Copilot, Rockwell Design Studio Copilot, MaintainX CoPilot | Bundled in enterprise/CMMS licences | No independent numbers; Siemens 100+ customers | Manual PDFs, breakdown log, phones | Very high (RAG bot in Telegram/WhatsApp) |
