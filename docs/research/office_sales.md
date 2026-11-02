# IT and AI for the office, sales, procurement and documents side of Western manufacturers and industrial suppliers (2024-2026)

Scope note: almost all quantitative results below are vendor-published case studies (self-selected best customers, not audited). Where a number came only from a search-result summary and the page was not opened, it is marked "(snippet)". Independent evidence is scarce; the most independent items are the Gartner 2024 forecast and the MIT NANDA 2025 report (via press coverage).

## 1. AI quoting / CPQ for manufacturers (quoting from drawings and RFQs)

### Takeaway
Quoting software for job shops (Paperless Parts, aPriori) and configure-to-order CPQ (Tacton) consistently claims 50-90% shorter quote cycles and 10-30% higher win rates, but all numbers are vendor case studies and pricing is quote-only. The core value is speed of response (days to hours), which shops tie directly to win rate.

### Cited Findings
- Pindel Global Precision (machine shop): annual quotes doubled from 375 to 700, win rate +30%, quoting "10x faster" with Paperless Parts - [Paperless Parts case study](https://www.paperlessparts.com/case-studies/pindel-global-precision-doubles-its-number-of-annual-quotes-increases-win-rate-by-30-with-paperless-parts/)
- Zero Hour Parts: quoting time halved, quote throughput +200%, a critical quote returned 9x faster, win rate +10%; offers 4-hour guaranteed quote turnaround - [Paperless Parts case study](https://www.paperlessparts.com/case-studies/zero-hour-parts-fulfills-a-need-for-speed-offers-4-hour-guaranteed-quote-turnaround/)
- Hillside Custom: quote turnaround from ~2 weeks to 2 days (win rate up, no %) - [Paperless Parts case study](https://www.paperlessparts.com/case-studies/hillside-custom-reduces-quote-time-from-2-weeks-to-2-days-with-paperless-parts/)
- KT Tech: quoting from 1+ full days to 2 hours - [Paperless Parts case study](https://www.paperlessparts.com/case-studies/kt-tech-saves-time-generates-more-revenue-with-paperless-parts/)
- Hirsh Precision Products: average quote time cut by 3.75 hours; ~2,000 hours/year saved (title) - [Paperless Parts case study](https://paperlessparts.com/case-studies/hirsh-precision-product/)
- Precision Machine: ~80% of revenue comes from quotes with under 1 hour draft-to-send time; works from PDFs (not only 3D CAD) - [Paperless Parts case study](https://www.paperlessparts.com/case-studies/precision-machine/)
- Paperless Parts pricing: no public price; custom quote. Old 2019 press-release tiers $300 and $750/month (likely outdated); no free plan - [FitGap](https://us.fitgap.com/products/paperless-parts); [Capterra](https://www.capterra.com/p/179259/paperlessPARTS/)
- Tacton CPQ, Husky: quoting time -75%, >95% of engineering BOM generated automatically (snippet) - [casestudies.com](https://www.casestudies.com/company/tacton/case-study/huskys-solution-time-reduced-75-with-tacton-cpq)
- Tacton, Metso: 40% proposal resource savings (headline, snippet) - [casestudies.com](https://www.casestudies.com/company/tacton/case-study/metso-minerals-separation-increased-quotation-volume-with-20)
- Tacton, HMF Group (cranes): 70-80% engineering resources saved (snippet) - [Cuspera](https://www.cuspera.com/products/tacton-cpq-software-x-3413/customer-story)
- Tacton, TPC Wire & Cable: integrated with Epicor ERP and Salesforce; faster, more accurate quotes, less engineering backlog (no %) - [casestudies.com](https://www.casestudies.com/company/tacton/case-study/tpc-wire-cable-improves-customer-experience-and-operational-efficiencies-with-tacton-cpq)
- aPriori (cost modeling from 3D CAD): HARBEC moved to automated, often same-day quoting with quoted costs closer to actuals; Soucy got 2.5-day quoting with supplier-specific cost models (snippets) - [HARBEC](https://www.casestudies.com/company/apriori/case-study/how-to-automate-rfqs-in-manufacturing); [Soucy](https://www.casestudies.com/company/apriori/case-study/how-soucy-streamlined-their-quoting-process-with-international-suppliers)
- Xometry (marketplace instant quoting): launched injection-molding auto-quote in US Oct 2025 after Europe earlier in 2025, "from days to minutes"; Q2 2025 record marketplace gross margin 35.4% attributed to improved AI pricing/selection algorithms; March 2026 upgraded lead-time prediction and dynamic pricing, models retrained on completed orders (snippets) - [Xometry IR](https://investors.xometry.com/news-releases/news-release-details/xometry-introduces-auto-quote-capability-injection-molding); [MarketBeat Q2 2025 call](https://www.marketbeat.com/earnings/reports/2025-8-5-xometry-inc-stock); [Digital Commerce 360, Mar 2026](https://www.digitalcommerce360.com/2026/03/03/xometry-tightens-grip-on-ai-sourcing/amp/)
- Aleran "Built to Sell 2025" (vendor survey): 91% of manufacturers have or plan AI-powered sales automation; "nearly 9 in 10" report measurable sales growth from digital quoting/CPQ (vendor-funded, treat with caution) - [Aleran](https://www.aleran.com/built-to-sell-2025/ai-for-manufacturing-fueling-future-of-b2b-sales/)

### Inferences
- Pattern for a small studio: an "RFQ inbox to draft quote" tool (LLM reads email + PDF drawing title block/BOM, pulls material, quantity, tolerances, finish; looks up price tables/past jobs; produces draft quote for estimator) mirrors the PDF-quoting path of Paperless Parts without 3D geometry analysis. Data prerequisite: historical quotes with won/lost status, cost/rate tables (machine hour rates, material prices), and drawings archive.
- Win-rate effect is driven mainly by response time; a studio pitch can be framed around "quote in hours, not days."
- True geometry-based costing (aPriori, Xometry) requires CAD feature recognition and large order histories; not realistic for a small studio to replicate.

### Gaps
- Hyperquote: no results found in search; no data on product, customers or price.
- No independent (non-vendor) study of win-rate effects of quoting software.
- No current public pricing for Paperless Parts, Tacton, aPriori.
- Xometry's share of orders priced fully automatically: not disclosed in results found.

## 2. Document AI: invoices, delivery notes, certificates of conformity, mill test certificates, purchase orders

### Takeaway
IDP vendors claim 70-95% automation/time savings and ~95-97% field accuracy in manufacturing; pricing ranges from ~$0.02-0.30 per workflow step (Nanonets) to ~$18k/year entry (Rossum). Mill test certificate (MTC/MTR) extraction is an emerging niche with flat-fee tools (~GBP 275/month) and no independent accuracy benchmarks; human review remains standard.

### Cited Findings
- Rossum, manufacturing customers: claims up to 94.9% field accuracy and 95% time saved per document (vendor marketing pages, incl. Lincoln Electric page) - [Rossum discover](https://discover.rossum.ai/); [Rossum Lincoln Electric](https://discover.rossum.ai/lincolnelectric)
- Rossum, Morton Salt: production in ~1 month, 71% automation rate, processing time cut up to 95% (snippet) - [casestudies.com](https://www.casestudies.com/company/rossum/case-study/how-morton-salt-saves-up-to-95-of-its-time-per-document)
- Rossum, Molson Coors: 97.3% accurate template-free invoice automation in 3 days (snippet, context not verified) - [casestudies.com Rossum list](https://www.casestudies.com/vendor/rossum)
- Rossum pricing: Starter plan reported ~$18,000/year; volume-based; volume allowance/overage not public; reviewers list "expensive" and per-document pricing as cons - [aitoolsatlas](https://aitoolsatlas.ai/tools/rossum/pricing); [Gartner Peer Insights](https://www.gartner.com/reviews/product/rossum)
- Competitor Lido claims Rossum costs "$10+ per document" (competitor claim, unverified) - [Lido](https://lido.app/blog/rossum-alternative)
- Nanonets pricing: moved in 2025 from page-based (~$0.30/page after 500 free pages) to block-based (~$0.02 simple to ~$0.30 complex AI step; typical invoice 4-6 blocks); official page lists $0.05/step execution and $0.3/page; free start with credits; enterprise custom - [PricingSaaS 2025Q1](https://pricingsaas.com/companies/nanonets/diffs/2025Q1); [Nanonets pricing](https://nanonets.com/pricing)
- Docsumo: no public dollar price; free tier up to 1,000 pages; paid plans quote-based; third-party sources conflict ($49/month vs $500/month entry) - [TrustRadius](https://www.trustradius.com/products/docsumo/pricing); [G2](https://www.g2.com/products/docsumo-docsumo/pricing)
- MTC/MTR extraction: GoSmarter MillCert Reader ~GBP 275/month flat per workspace, unlimited users; Apolo "MTR CrossCheck" validation; DocumentIQ (Algoscale) claims a steel distributor flagged out-of-spec material before shipment from thousands of MTCs (vendor) - [DocumentIQ blog](https://documentiq.algoscale.com/blog/automating-mill-test-certificate-mtc-mtr-extraction-metals-manufacturing); [DocumentIQ case](https://documentiq.algoscale.com/case-studies/quality-certificate-compliance); [Apolo MTR CrossCheck](https://lifestyle.capitalcityrock.com/story/161478/apolo-expands-ai-launchpad-with-mtr-crosscheck-ai-powered-mill-test-report-validation/)
- MTR layouts are not standardized across mills; automation removes transcription, not review, so most implementations keep an approval checkpoint - [Revolution Data Systems](https://revolutiondatasystems.squarespace.com/blog/mill-test-report-automation); [BISOK](https://blog.bisok.com/general-technology/automating-mill-test-report-processing)
- Review aggregators advise validating accuracy claims on the buyer's own document samples - [toolsforhumans Rossum review](https://www.toolsforhumans.ai/ai-tools/rossum)

### Inferences
- For a studio, an LLM-based extractor (vision model + JSON schema + validation rules + human-in-the-loop UI) can undercut Rossum (~$18k/yr) for SMBs with hundreds to low thousands of docs/month. Key differentiator vs. generic IDP: checks against business rules (e.g., MTC chemistry/mechanical values vs. EN 10204 3.1 / ASTM spec limits; invoice vs PO vs delivery note 3-way match).
- Data prerequisites: 50-200 labeled sample documents per type, master data (supplier list, SKU/material codes, spec limits), ERP API or import format.

### Gaps
- No independent accuracy benchmarks for MTC extraction or for Rossum/Nanonets/Docsumo on manufacturing docs.
- Certificates of conformity and delivery notes: no specific case with numbers found.

## 3. Order intake automation (email/PDF PO into ERP)

### Takeaway
Sales order automation (Conexiom, Esker, newer LLM agents) reports 70-80%+ touchless orders and very large CSR time savings at distributors and manufacturers. A small-shop LLM pipeline (Zapier + ChatGPT) at a Hamburg parts maker cut per-order time from 15-20 min to under 1 min, showing this is buildable by a studio.

### Cited Findings
- Anonymized global appliance/electrical manufacturer replaced Esker and RPA with Conexiom, reaching 70% touchless orders across divisions (target 80%) - [Conexiom PDF](https://conexiom.com/wp-content/uploads/2023/04/Major-Global-100-Company-Safety-Security-and-Energy.pdf) (2023 doc, slightly before scope)
- Pfizer + Conexiom: 80%+ of orders touchless, email to ERP in under 5 minutes (promotional post, snippet) - [Conexiom case list](https://www.casestudies.com/company/conexiom)
- Revere Electric Supply: up to 95% order-entry time savings (headline) - [casestudies.com](https://www.casestudies.com/company/conexiom/case-study/revere-electric-supply-co-customer-case-study)
- Werner Electric Supply: 20% sales automation, 6,263 CSR hours saved (snippet) - [Conexiom case list](https://www.casestudies.com/company/conexiom)
- ADI Global: 142 hours/day saved (case title) - [casestudies.com](https://www.casestudies.com/company/conexiom/case-study/adi-global-saves-142-hoursday-with-conexiom)
- Conexiom cites a 2018 study: 70% of customers prefer to email POs (old, but the main argument for email-to-ERP) - [Conexiom blog](https://conexiom.com/blog/improve-purchase-order-process/)
- Hamburg mechanical-parts manufacturer (agency hagel IT-Services): Outlook inbox -> ChatGPT extracts customer, PO no., date, SKU, qty, ship-to as JSON -> Google Sheets log -> QuickBooks draft invoice; time per order 15-20 min -> <1 min review; order processing time -70%+; 30-40 orders on busy day; ~8 h/day staff time -> ~30 min/day review (~90 s/order); invoice lag 24-48 h -> instant; errors "virtually eliminated" (no %); article undated - [Zapier blog](https://zapier.com/blog/hamburg-manufacturer-processes-orders-with-ai)
- Touchless benchmarks conflict: Lleverage claims 60-80%; Zycus says rules-based platforms plateau at 30-60% and 75%+ needs agentic AI; one blog cites 96% for mature implementations (all vendor/secondary) - [Lleverage](https://www.lleverage.ai/use-cases/order-automation); [Zycus](https://www.zycus.com/?p=257531); [ahoosh](https://ahoosh-site.pages.dev/articles/2026-06-10_ai-order-entry-2026)
- SysGenPro (vendor) describes a regional distributor (12,000 orders/month, 8 clerks): manual workload -65%, order accuracy 94% -> 99.3% (unverified vendor story) - [SysGenPro](https://sysgenpro.com/ai/how-distribution-firms-are-using-ai-agents-to-replace-manual-order-processing-and-improve-roi)
- Typical LLM agent architecture: trigger on new email -> classify PO vs not -> extract PO number/lines -> search ERP -> create or update order - [ZBrain](https://zbrain.ai/agents/Operations/all/Order-Entry-Processing/order-entry-management-agent/)

### Inferences
- This is the strongest "small studio" product: inbox watcher + LLM extraction + SKU matching to customer part numbers + ERP API (1C, SAP B1, Odoo, etc.) + exception queue UI. The hard part is customer-part-number to internal-SKU mapping and price/stock validation, not the OCR.
- Data prerequisites: email access, ERP API, item master with customer cross-references, price lists; 1-3 months of historical POs for testing.

### Gaps
- No independent, audited touchless-rate benchmark. Conexiom/Esker pricing not found.

## 4. Knowledge assistants / RAG over SOPs, specs, standards and service manuals

### Takeaway
Major field-service vendors ship GenAI assistants over manuals and service history (PTC ServiceMax AI, Feb 2025), and McKinsey published an Ascendum case, but hard measured outcomes are scarce; the most cited number (35% faster diagnosis) is unverified.

### Cited Findings
- PTC ServiceMax AI (Feb 2025): GenAI assistant that searches manuals, troubleshooting guides and service history to answer technician questions and recommend resolutions; no outcome metrics in launch - [PTC news](https://www.ptc.com/en/news/2025/ptc-launches-servicemax-ai)
- McKinsey / Ascendum (heavy equipment dealer): baseline diagnosis could take up to 30 minutes while agents search customer and technical info; pilot improved first-time resolution (no % in snippet; page fetch timed out) - [McKinsey case study](https://www.mckinsey.com/capabilities/tech-and-ai/case-studies/adding-a-powerful-new-tool-to-the-field-mechanics-toolbelt-ai)
- Automotive supplier LLM copilot linked to PDF manuals and CMMS: time-to-diagnosis -35% (secondary article, no named company/methodology; unverified) - [C# Corner](https://www.c-sharpcorner.com/article/llms-that-fix-things-field-service-assistants-from-triage-to-wrench-time)
- iOPEX (retail tech, Feb 2026): 92% AI accuracy, 28% fewer escalations (not manufacturing) - [iOPEX](https://iopex.com/case-studies/retail-tech-leader-achieves-92-ai-accuracy-with-agentic-ai-led-field-service)
- Bruviti: customer-facing assistant cut inbound service calls up to 20% (vendor) - [Bruviti](https://bruviti.com/?p=5563)

### Inferences
- RAG assistant over manuals/SOPs/standards (with page-level citations, served in Telegram/WhatsApp/web) is cheap to build and easy to demo; measured ROI is weak in public literature, so pilots should define baseline metrics (time to answer, first-time fix, escalations).
- Data prerequisites: digitized manuals/SOPs (scanned PDFs need OCR), document access rights, service ticket history for evaluation questions.

### Gaps
- No independent measured result for RAG over SOPs/standards in manufacturing found. McKinsey Ascendum numbers not retrieved (fetch timeout).

## 5. B2B dealer/customer portals and AI sales copilots, lead scoring

### Takeaway
Self-service B2B portals reach 50-85% of order share at some manufacturers; AI "next best product" recommendations for distributors (Proton.ai) claim double-digit revenue lifts. McKinsey's B2B Pulse 2024 found 19% of B2B decision makers already implementing GenAI for buying/selling.

### Cited Findings
- Buff Inc. (accessories manufacturer): half of all customer orders now through self-service B2B portal; reactivated dormant accounts (Handshake) - [Handshake](https://pages.handshake.com/WC-Resources-CS-Buff_LP-Download-New.html)
- Dunlop protective footwear: >80% of customers use the self-service portal, now main communication channel (snippet) - search result, source page via [Corevist/Spryker results](https://www.corevist.com/?p=25946)
- Global cosmetics manufacturer (Sitecore): 85% of salon ordering online, reduced call-center costs (title) - [casestudies.com](https://www.casestudies.com/company/sitecore/case-study/global-cosmetics-manufacturer-completes-b2b-order-management-takeover)
- Proton.ai, Hill & Markes (distributor, 50,000-SKU site): A/B test +43% average revenue per customer; Sept 2021 ecommerce sales +53% vs Sept 2019 (pre-2024 data) - [casestudies.com](https://www.casestudies.com/company/proton/case-study/how-a-distributor-increased-monthly-ecommerce-revenue-by-53-with-a-simple-proton-integration)
- Proton.ai, R.S. Hughes: recommendations used by 175 inside salespeople serving ~10,000 customers/month; recommendations draw on ERP, CRM and ecommerce data - [Proton case](https://proton.ai/case-study/rshughes); [Industrial Supply Magazine](https://industrialsupplymagazine.com/pages/Print-edition---MarApr22_RS-Hughes.php)
- McKinsey B2B Pulse 2024: 3,942 B2B decision makers in 13 countries; 19% already implementing GenAI use cases for B2B buying/selling - [Digital Commerce 360](https://www.digitalcommerce360.com/2024/09/13/how-b2b-companies-are-getting-excited-by-ai/)

### Inferences
- Studio-buildable: a dealer portal (catalog, prices per contract, stock from ERP, reorder from history, order status, documents download) plus a "reorder reminder / cross-sell" module using simple purchase-history rules before ML. Prerequisite: clean item master, customer-specific price lists, ERP stock/order API.

### Gaps
- No 2024-2026 case with a measured order-entry cost reduction from a manufacturer portal found. Lead scoring for manufacturers: no concrete case found in this pass.

## 6. Tender/RFP monitoring and AI bid writing

### Takeaway
RFP response tools (Loopio, AutogenAI) target large bid teams at ~$20k+/yr; tender monitoring tools (Tendium, Tenderstria) are cheap (EUR 125-300/month). Win-rate claims are vendor-only. A custom TED-monitoring build for an SME was quoted at EUR 18k + EUR 150/month.

### Cited Findings
- Loopio: per-seat, not public; entry "Foundations" tier reported ~$20,000/year (competitor-sourced) - [AutoRFP.ai](https://autorfp.ai/blog/best-loopio-alternatives)
- AutogenAI claims 22% higher win rates and 30% less time per RFP (own page); MH&A study (May 2025, hosted by AutogenAI): users grew revenue 12.4% FY23-FY24 vs -7.1% for non-users - [AutogenAI vs Loopio](https://autogenai.com/blog/autogenai-vs-loopio)
- Tendium: from EUR 125/month (EUR 1,500/yr), monitoring + AI writing; testimonials Adecco -50% bidding time, Sigma Technology 95% resource saving (vendor) - [Tendium](https://tendium.ai/services)
- Tenderstria: reads TED and other portals, from $299/month - [G2](https://www.g2.com/products/tenderstria/reviews)
- BidSoftware (UK G-Cloud): AI bid writing GBP 2,750+VAT/yr for 1 user; 2-3 users GBP 4,900; 4-5 users GBP 6,500 - [G-Cloud pricing doc](https://assets.applytosupply.digitalmarketplace.service.gov.uk/g-cloud-15/documents/722937/235634672648809-pricing-document-2026-01-29-1655.pdf)
- Kolonell (consultancy blog): custom tool for a Brussels construction SME reading TED + Belgian e-Procurement, EUR 18,000 build + EUR 150/month API/hosting, monitoring down to 2 h/week (vendor marketing) - [Kolonell](https://kolonell.com/en/blog/ai-tender-monitoring-construction-sme-brussels-2026)

### Inferences
- Tender monitoring + qualification + first-draft bid from a company knowledge base is a realistic studio product; the Kolonell price point is a useful Western anchor for custom builds.

### Gaps
- No independent manufacturer case with measured win-rate change. AutogenAI pricing not found. GovSpend-style US monitoring pricing not researched.

## 7. Supplier risk / procurement AI and demand forecasting for SMB manufacturers and food producers

### Takeaway
Supplier risk platforms (Prewave) serve large OEMs (Audi, BMW, Kärcher) with quote-only pricing and are driven by EU due-diligence law (LkSG). For SMBs, demand planning tools like Netstock show food-sector results of 35-52% inventory reduction and 99% fill rates (vendor).

### Cited Findings
- Prewave: AI monitoring of 200+ risk categories, Tier-N mapping; customers Audi, BMW, Ferrari, Kärcher, Renault, Hilti; pricing quote-based by suppliers monitored; Kärcher implemented it for LkSG compliance (no quantified outcome public) - [ERP Research](https://erpresearch.com/erp-add-ons/supplier-management/prewave); [Gartner Peer Insights](https://www.gartner.com/reviews/product/prewave); [Kärcher case](https://www.casestudies.com/company/prewave/case-study/karcher-customer-case-study)
- Netstock, Sunbeam Foods (US): within 17 months fill rate >99%, inventory value -52%, excess stock -80% - [casestudies.com](https://www.casestudies.com/company/netstock/case-study/sunbeam-foods-grows-their-business-with-netstock)
- Netstock, Eustralis Food & Wine: inventory -35% in 7 months (snippet); B&G Ltd excess inventory -30%+ in <12 months - [Netstock case list](https://www.casestudies.com/company/netstock); [Netstock B&G](https://www.netstock.com/case-studies/bg-ltd/)
- Netstock, The Little Potato Company: 98% forecast accuracy (vendor) - [Netstock PDF](https://www.netstock.com/wp-content/uploads/2023/07/The-Little-Potato-Company-Netstock-Case-Study.pdf)

### Inferences
- Netstock-style tools plug into SMB ERPs (Acumatica, Business Central etc.); for a studio, a lightweight forecast + reorder-point dashboard over ERP sales history is buildable, but value depends on 2+ years of clean sales and stock data. Dates of Netstock cases may predate 2024.

### Gaps
- Netstock and Lokad pricing not found. No SMB-scale supplier risk tool with prices found.

## 8. Measured failures, hallucination risks and client complaints

### Takeaway
The macro evidence is sobering: Gartner forecast (2024) that 30%+ of GenAI projects would be abandoned after PoC by end-2025, and MIT NANDA (2025) reported ~95% of pilots without measurable return, with back-office automation cited as giving better ROI than sales/marketing. Product-level complaints center on price, per-document pricing and accuracy that must be validated on own documents.

### Cited Findings
- Gartner (July 2024): at least 30% of GenAI projects abandoned after PoC by end-2025 due to poor data quality, inadequate risk controls, escalating costs or unclear business value - [Gartner press release](https://gcom.pdo.aws.gartner.com/en/newsroom/press-releases/2024-07-29-gartner-predicts-30-percent-of-generative-ai-projects-will-be-abandoned-after-proof-of-concept-by-end-of-2025)
- MIT NANDA "The GenAI Divide: State of AI in Business 2025": ~95% of organizations saw no measurable GenAI return; causes brittle workflows, weak contextual learning, poor fit with operations; sales/marketing hold ~50-70% of AI budgets (sources disagree) while back-office automation yields better ROI; sample sizes reported inconsistently - [Computing](https://computing.co.uk/news/2025/ai/mit-report-95pc-corporate-generative-ai-pilots-fail); [Let's Data Science](https://letsdatascience.com/news/mit-report-documents-genai-pilot-roi-gap-e0924d7d)
- Rossum reviews: "expensive" and per-document pricing among cons; one manufacturing reviewer rated 3.0 - [Gartner Peer Insights](https://www.gartner.com/reviews/product/rossum)
- MTC automation: no standard layout; human approval checkpoint retained - [BISOK](https://blog.bisok.com/general-technology/automating-mill-test-report-processing)
- Field service GenAI: observers still lack quantified ROI - [AutomationInside](https://mail.automationinside.com/article/llm-copilots-for-technicians-from-manuals-to-moments-of-need)

### Inferences
- Sell narrow, back-office, measurable automations (order intake, document extraction with validation, quote drafting) with human review and baseline metrics, rather than open-ended "AI chat" pilots. Hallucination risk is managed by structured extraction against master data and confidence-based exception queues.

### Gaps
- No documented named manufacturing failure case (e.g., wrong order booked by LLM) found.

## Catalogue summary (solution type | example vendors | typical price | key data prerequisites)

- Quote drafting from RFQ/drawings | Paperless Parts, aPriori, Tacton, Xometry | quote-only; Paperless Parts historically $300-750/mo (2019) | past quotes with win/loss, rate & material tables, drawings
- IDP for invoices/POs/delivery notes | Rossum, Nanonets, Docsumo | Rossum ~$18k/yr entry; Nanonets ~$0.02-0.30/step | sample docs, supplier/SKU master, ERP import
- Mill test / quality certificate check | GoSmarter MillCert, DocumentIQ, Apolo | ~GBP 275/mo flat | spec limits per grade, PO/heat numbers
- Email/PDF order intake to ERP | Conexiom, Esker, Lleverage, custom LLM (Zapier+ChatGPT) | enterprise quote-only; custom is cheap | ERP API, customer part-number cross-reference, price lists
- RAG assistant on manuals/SOPs | PTC ServiceMax AI, Bruviti, custom | not found | digitized manuals, ticket history
- Dealer/customer self-service portal | Corevist, Intershop, Dynamicweb, Sitecore, Handshake | not found | item master, contract prices, ERP stock/order API
- AI cross-sell / sales copilot | Proton.ai | not found | ERP/CRM/ecommerce order history
- Tender monitoring + bid writing | Tendium, Tenderstria, BidSoftware, Loopio, AutogenAI | EUR 125/mo to ~$20k/yr; custom EUR 18k + 150/mo | past bids, company documents, CPV codes
- Supplier risk monitoring | Prewave | quote-only | supplier list, Tier-N data
- Demand forecasting for SMB/food | Netstock, Lokad | not found | 2+ yrs sales & stock history
