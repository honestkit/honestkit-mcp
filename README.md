# honestkit-mcp

An open-source [MCP](https://modelcontextprotocol.io) server (Node, stdio) that exposes 14 public Apify actors published under the [`forevertools`](https://apify.com/forevertools) username as tools: scrapers, SEO/site checks, and extraction utilities. Built and maintained by an AI-assisted process.

## Cost: read this first

The server is free (MIT). But every tool call **runs an Apify actor on your own Apify account**, using **your** `APIFY_TOKEN`. Runs are billed **pay-per-event to your Apify account** at the prices listed on each actor's Store page (linked in the table below). Check the price before you run large jobs. This project does not receive any of that money apart from what Apify pays the actor author.

## Install

Requires Node 18+ and an [Apify API token](https://console.apify.com/settings/integrations).

Local:

```bash
git clone https://github.com/honestkit/honestkit-mcp && cd honestkit-mcp
npm install
APIFY_TOKEN=your_token node index.mjs
```

Or without cloning: `APIFY_TOKEN=your_token npx -y github:honestkit/honestkit-mcp`

## Claude Desktop config

```json
{
  "mcpServers": {
    "honestkit": {
      "command": "npx",
      "args": ["-y", "github:honestkit/honestkit-mcp"],
      "env": { "APIFY_TOKEN": "your_apify_token" }
    }
  }
}
```

## Tools

Each tool takes the actor's input as arguments and returns the dataset items. Output is truncated to about 50 items / 20,000 characters with a note; use the Apify console for full datasets.

| Tool | Title | Store page (pricing) |
|---|---|---|
| `apple_app_store_reviews` | App Store Reviews Scraper – Apple iOS, Multi-Country | [apple-app-store-reviews](https://apify.com/forevertools/apple-app-store-reviews) |
| `article_extractor` | Article Scraper & Text Extractor – Clean Markdown for LLM/RAG | [article-extractor](https://apify.com/forevertools/article-extractor) |
| `ats_company_jobs` | Job Postings & Career Page Scraper – Workday, Greenhouse, Lever (+16 more ATS incl. Oracle, ADP, BambooHR, Jobvite) | [ats-company-jobs](https://apify.com/forevertools/ats-company-jobs) |
| `bluesky_posts` | Bluesky Posts Scraper – Profiles & Threads, No Login | [bluesky-posts](https://apify.com/forevertools/bluesky-posts) |
| `company_website_enrichment` | Company Enrichment from Domain (Logo, Socials, Tech) | [company-website-enrichment](https://apify.com/forevertools/company-website-enrichment) |
| `domain_whois_dns_ssl` | DNS Lookup & WHOIS Domain Checker — SPF/DMARC, SSL Expiry | [domain-whois-dns-ssl](https://apify.com/forevertools/domain-whois-dns-ssl) |
| `email_syntax_mx_checker` | Email Validator & MX Record Checker – Bulk, Disposable, Role | [email-syntax-mx-checker](https://apify.com/forevertools/email-syntax-mx-checker) |
| `pagespeed_core_web_vitals` | Bulk PageSpeed Insights, Lighthouse & Core Web Vitals | [pagespeed-core-web-vitals](https://apify.com/forevertools/pagespeed-core-web-vitals) |
| `pdf_to_text_extractor` | PDF Extractor & Parser – Bulk PDF to Text with Metadata | [pdf-to-text-extractor](https://apify.com/forevertools/pdf-to-text-extractor) |
| `website_seo_audit` | SEO Audit Crawler & Broken Link Checker – Website Health | [website-seo-audit](https://apify.com/forevertools/website-seo-audit) |
| `sitemap_url_status_checker` | Sitemap Extractor & Bulk URL Status Checker | [sitemap-url-status-checker](https://apify.com/forevertools/sitemap-url-status-checker) |
| `steam_reviews` | Steam Reviews Scraper – Game Reviews & App Details | [steam-reviews](https://apify.com/forevertools/steam-reviews) |
| `website_tech_stack_detector` | Website Technology Detector – Tech Stack, CMS & Analytics | [website-tech-stack-detector](https://apify.com/forevertools/website-tech-stack-detector) |
| `website_screenshot` | Website Screenshot API – Bulk Full Page PNG, JPEG & PDF | [website-screenshot](https://apify.com/forevertools/website-screenshot) |

## Development

`tools.json` is generated from the actors' `.actor/actor.json` and `input_schema.json` files: `npm run build`. Smoke test (lists tools, expects 14; no live call is made by the test): `npm test`.

## License

MIT, copyright Honestkit.
