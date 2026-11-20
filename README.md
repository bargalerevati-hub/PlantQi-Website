# Plant Qi website

The storefront for [Plant Qi](https://www.plantqi.com): calm, well-made journals for small, steady change.

Built with plain JavaScript (ES modules) and [Vite](https://vitejs.dev). No framework, no runtime dependencies. Deployed on [Vercel](https://vercel.com).

## Getting started

Requires Node.js 22 (see `.nvmrc`).

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build locally
npm run lint
```

## Project structure

```
api/                    Vercel functions: /api/order and /api/contact
google-apps-script/     Script that runs inside the orders Google Sheet
docs/                   Setup guides
index.html              Page shell: SEO meta, header, footer, SVG sprite
public/                 Static files served as-is (images, favicon, robots.txt, sitemap.xml)
src/
  main.js               App start-up: router, page meta updates, bag count
  routes.js             Every page: renderer, title, description, structured data
  seo.js                <head> tags and JSON-LD (Product, Organization, Breadcrumbs)
  config.js             Site settings (email, Instagram, form backend)
  data/                 Products, colours, reviews, Indian states
  lib/                  Router, cart, form sending and validation, storage, formatting
  components/           Shared HTML pieces (product card, reviews, summary, order bar)
  pages/                One module per page
  styles/               Design tokens, base, layout, components, pages, motion
scripts/prerender.js    Build step: static HTML per page + sitemap.xml
vercel.json             Page rewrites, redirects, caching and security headers
```

`npm run build` runs Vite, then `scripts/prerender.js`, which saves each public page as finished HTML in `dist/pages/` (so search engines see full content without JavaScript) and writes `sitemap.xml`. Page titles, descriptions and structured data live in `src/routes.js` and `src/seo.js`. A new public page needs an entry in `src/routes.js` and a matching rewrite in `vercel.json`; the build fails with a message if the rewrite is missing.

Pages use clean URLs (`/shop`, `/journal-2027`, `/bag`, `/checkout`, `/story`, `/contact`, `/help`). Old `#hash` links from the single-file site redirect automatically.

## Orders and contact form

No payment is taken on the site. Checkout posts to `/api/order`, a Vercel function that rechecks the details, prices the order from the catalogue, and saves it as a row in a Google Sheet (with an email to hello@plantqi.com). Contact messages go through `/api/contact` to the same sheet.

**Setup:** follow [docs/ORDERS_SETUP.md](docs/ORDERS_SETUP.md). You'll need two Vercel environment variables, `SHEET_WEBHOOK_URL` and `SHEET_SECRET`.

`npm run dev` has no API, so forms run in preview mode locally and nothing is saved.

## Deployment

Every push to `main` deploys to production on Vercel, and pull requests get preview URLs. GitHub Actions (`.github/workflows/ci.yml`) runs lint and build on each push.
