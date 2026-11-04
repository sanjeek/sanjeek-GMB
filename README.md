# GMB Curtains & Blinds

A complete, responsive website proposal for GMB, prepared for **sanjeek/GMB** and **Vercel**. The design uses warm ivory, burgundy, editorial serif typography and an image-led collection layout.

## Included

- Home, curtains, indoor blinds, plantation shutters, outdoor blinds, our story, inspiration, contact and privacy pages, plus a custom 404.
- Mobile navigation, product navigation, native expandable FAQs and a filterable inspiration gallery.
- Quote enquiry form with validation, product preselection, consent and honest email fallback.
- Vercel contact function with server-side input validation, escaping, a honeypot and Resend delivery integration.
- Unique page titles and descriptions, canonical URLs, social sharing metadata, local business / page / FAQ structured data, sitemap and robots file.
- Responsive layouts, visible keyboard focus, reduced motion support, semantic headings, image alt text and reserved image dimensions.
- No frontend framework or third-party JavaScript runtime dependencies.

## Run locally

Requires Node.js 20 or later. No dependency installation is needed.

```sh
npm run build
npm test
npm run dev
```

Open http://localhost:3000. The local contact route deliberately returns unavailable and offers the email fallback. The local server is a development preview, not the production hosting server.

## Deploy to Vercel

1. Create an empty `sanjeek/GMB` repository and upload / push this source.
2. Import that repository in Vercel. Framework preset: **Other**.
3. Build command: `npm run build`. Output directory: `dist`. These are also set in `vercel.json`.
4. Keep `INDEX_SITE=false` for the proposal. Vercel will publish a review URL.
5. For enquiry delivery, add the server-only variables below and redeploy.
6. Review the site at desktop and phone widths before sending it to the business.

### Environment variables

| Variable | Purpose |
|---|---|
| `SITE_URL` | Approved full public URL. Optional on Vercel; the build otherwise uses Vercel's production project URL, deployment URL, then localhost. |
| `INDEX_SITE` | `false` for a proposal; only `true` on an approved production launch. |
| `RESEND_API_KEY` | Server-only Resend API key. |
| `CONTACT_FROM_EMAIL` | Sender address on a verified Resend domain. |
| `CONTACT_TO_EMAIL` | Approved inbox for enquiries. GMB's published inbox is `info@gmbcurtainsandblinds.com.au`. |

Never commit secrets. Do not use a `PUBLIC_` prefix for email credentials. The form confirms delivery only after the email provider accepts the message. If unavailable, visitors can open a populated email draft or call the business. No automated reply promise is made.

Before enabling the endpoint for production, configure appropriate Vercel firewall/rate limits or an approved bot challenge. The honeypot and browser origin check are basic measures, not durable rate limiting.

## SEO launch notes

Proposal builds deliberately use `noindex,nofollow` and `Disallow: /`. SEO foundations are implemented, but a proposal must not compete with the live business domain. When approved, set the real `SITE_URL` and `INDEX_SITE=true`, redeploy, verify canonicals and robots, submit the sitemap to Search Console, and plan redirects from replaced URLs. FAQ markup describes visible questions; it does not guarantee rich search results. Search rankings are not guaranteed.

## Content and photography

Published business facts used: business name; Melbourne / family-owned manufacturer; Cranbourne West showroom; public telephone, email and address; existing product categories and free measure / quote offering. No review ratings, fabricated testimonials, years-in-business claim, guaranteed turnaround time, fixed prices or product warranties were invented.

Room photography is served by `images.unsplash.com` as **illustrative interior inspiration**, not as evidence of completed GMB projects. The gallery explicitly labels this. Before a real business launch, replace these images with approved GMB installation and product photography, check image usage rights, and obtain final approval of all product / service details.

The privacy page is draft proposal information. The business must confirm its final policy, contact consent, retention practices and service providers.

## Verification

`npm test` checks the nine generated pages, internal links, unique titles, one H1 per page, metadata, structured data and image accessibility attributes. It also checks contact API method/origin/input rejection, missing configuration, provider success/failure and HTML escaping.

Visual browser QA and a live email delivery test remain necessary before business launch. The current environment has no connected browser QA tool. Vercel requires renewed login authorisation, and `sanjeek/GMB` must be created and granted to the GitHub connection before upload.
