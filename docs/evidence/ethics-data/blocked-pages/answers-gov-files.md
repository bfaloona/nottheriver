# Answers from three government file sets

Fetched 2026-11-15 with `node research/fetch-page.mjs` (crawler rules checked first, Node's own client name, one request per file). The saved files are kept locally, not in the repo. Counts are from the files as fetched; shop matches are by name against the first 100 rows of `../shop-domains.tsv`.

## What was fetched

| File | Result |
|---|---|
| `https://askebsa.dol.gov/FOIA%20Files/2025/Latest/F_5500_2025_Latest_layout.txt` and the `F_5500_SF` layout file | Not fetched. The host's `robots.txt` address returns an HTML page, so its crawler rules cannot be read, and the script skips a site in that state |
| `https://www.dol.gov/sites/dolgov/files/EBSA/about-ebsa/our-activities/public-disclosure/foia/form-5500-2025-data-dictionary.zip` | Fetched, cut at 5 MB (the file is larger). Six PDFs were recovered from the part held, including `2025-form-5500.pdf`, the form with each box's dataset field name printed in it |
| `https://www.dol.gov/sites/dolgov/files/EBSA/employers-and-advisers/plan-administration-and-compliance/reporting-and-filing/form-5500/2025-instructions.pdf` | Fetched whole (1,525,068 bytes). The address was a guess from the usual pattern; it returned 200 |
| `https://www.epa.gov/system/files/documents/2024-07/greenchill_2023_certified_stores.xlsx` | Fetched whole (83,303 bytes) |
| `https://www.epa.gov/system/files/other-files/2021-07/toplists.xml` | Fetched whole (283,524 bytes) |
| `https://www.epa.gov/system/files/documents/2025-01/partner100_oct2024.pdf` | Fetched whole (461,203 bytes) |

The four older GreenChill files (2019 to 2022) were not fetched; the report asks only about the 2023 file.

## Answers

| Question (report section) | Verdict | Answer | Where |
|---|---|---|---|
| Does a Form 5500 code mark employee ownership plans? (sections 10 and 11) | answered, from the form and its instructions, not the layout file | Yes. Line 8a of the form is the dataset field `TYPE_PENSION_BNFT_CODE`, which holds the plan's codes from the "List of Plan Characteristic Codes". Three codes are for employee stock ownership plans: `2O` "ESOP other than a leveraged ESOP", `2P` "Leveraged ESOP", `2Q` "The employer maintaining this ESOP is an S corporation". Limit: the code says a company sponsors such a plan, not what share of the company the plan owns, so it finds candidates for an "employee-owned" badge and does not prove one | `2025-form-5500.pdf` text lines 171 to 172; `2025-instructions.pdf` text lines 1666 to 1670 |
| GreenChill 2023 file: columns, and overlap with the top 99 (section 10) | answered | 893 store rows, one per certified store. Columns: `Supermarket`, `StoreNo`, `StreetAddress`, `City`, `State`, `ZipCode`, `CertificationLevel` (Platinum 610, Silver 169, Gold 114), `YearsofCertification`, `FullAddress`. 15 chains: ALDI 576, Publix 132, Target 78, Sprouts 55, Weis Markets 18, Whole Foods 11, Meijer 6, Costco 5, Stater Bros Market 4, Grocery Outlet 3, and one store each for Food Lion, ShopRite, Jimbo's Naturally, Hannaford and New Seasons Market. Top-99 overlap: two websites, `target.com` (20 saved results) and `costco.com` (23). The certificate belongs to a store, not a chain: 78 Target stores and 5 Costco stores hold it, so a chain-wide mark would overstate it; the street address allows a per-store match | The spreadsheet's first sheet |
| Does the live 100% green power table match the October 2024 PDF? (section 10) | answered | Yes. The live table's data file says `generated="2024-10-22T11:20:17"` and holds 265 entries tagged `FullGPUsers`; the PDF says "As of October 22, 2024" and "265 organizations". Every one of the 265 annual usage figures in the file appears in the PDF's text, and the PDF holds no usage figure that the file lacks (263 distinct figures) | `toplists.xml`; the PDF's text |
| Which retailers are on EPA's green power lists? (section 3, not asked in section 10) | extra | The same file holds the "Top 30 Retail" list with each partner's green power share. Ten of its names match top-99 websites: Walmart 29%, Target 48%, The Home Depot 29%, Best Buy 80%, Lowe's 13%, IKEA 104%, Tractor Supply 21%, REI 100%, Patagonia 103%, and The ODP Corporation (Office Depot) 100% for its headquarters only. Three of them are also on the 100% list: IKEA, REI, Patagonia | `toplists.xml`, entries tagged `Retail` and `FullGPUsers` |

## Not done

| Item | Why |
|---|---|
| The Form 5500 layout files themselves | The host's crawler rules cannot be read (see above). The field name comes from the annotated form instead |
| Whether any top-99 shop's parent files a Form 5500 with code `2O`, `2P` or `2Q` | Needs the yearly data file (a large zip on the skipped host) |
| The rest of the data dictionary zip (schedules past the first six files) | The saved copy was cut at 5 MB; the script now takes `--max-mb` for a larger limit |
