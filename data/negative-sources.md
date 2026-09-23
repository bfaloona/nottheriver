# Accepted sources for negative signals

A negative signal lowers a retailer's score only if the registrable domain of its `source_url` is in this table. The Worker reads the machine copy, `negative-sources.json`; a test fails if the two disagree. Every row was verified on 2026-09-23 by fetching the page in the "verified via" column and reading the organization's name on it; where that page sits on another domain, the rationale says how the listed domain ties to the organization.

To propose a source, open a pull request that adds a row here and in `negative-sources.json`, with a page that shows who runs the site.

| domain | organization | rationale | verified via |
|--------|--------------|-----------|--------------|
| ftc.gov | Federal Trade Commission | US consumer-protection and competition regulator; publishes enforcement actions and case records | https://www.ftc.gov/about-ftc |
| osha.gov | Occupational Safety and Health Administration (US DOL) | US workplace-safety regulator; publishes citations and settlements | https://www.osha.gov/aboutosha |
| dol.gov | U.S. Department of Labor | Parent of OSHA and the Wage and Hour Division; publishes wage-theft and labor enforcement releases | https://www.dol.gov/general/aboutdol |
| nlrb.gov | National Labor Relations Board | US agency that adjudicates unfair labor practice cases | https://www.nlrb.gov/about-nlrb |
| epa.gov | U.S. Environmental Protection Agency | US environmental regulator; publishes enforcement settlements | https://www.epa.gov/aboutepa |
| cpsc.gov | U.S. Consumer Product Safety Commission | US product-safety regulator; publishes recalls and civil penalties | https://www.cpsc.gov/About-CPSC |
| sec.gov | U.S. Securities and Exchange Commission | Securities regulator; enforcement actions and filings for public retailers | https://www.sec.gov/about |
| justice.gov | U.S. Department of Justice | Federal prosecutions and civil settlements | https://www.justice.gov/about |
| uscourts.gov | Administrative Office of the U.S. Courts | Federal judiciary; primary court records | https://www.uscourts.gov/about-federal-courts |
| courtlistener.com | Free Law Project (CourtListener) | Nonprofit archive of court opinions and federal filings, run by Free Law Project (https://free.law/about/) | https://www.courtlistener.com/ |
| goodjobsfirst.org | Good Jobs First (Violation Tracker) | Nonprofit database aggregating regulatory and court penalties by company | https://goodjobsfirst.org/violation-tracker/ |
| propublica.org | ProPublica | Independent nonprofit investigative newsroom | https://www.propublica.org/about/ |
| npr.org | NPR | Independent nonprofit news organization | https://www.npr.org/about/ |
| apnews.com | The Associated Press | Wire service; apnews.com is AP's news site and carries the "AP News" branding | https://www.ap.org/about/ |
