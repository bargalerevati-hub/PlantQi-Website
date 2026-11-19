# Plant Qi website

The storefront for [Plant Qi](https://plantqi.com): calm, well-made journals for small, steady change.

Built with plain JavaScript (ES modules) and [Vite](https://vitejs.dev). No framework, no runtime dependencies. Deployed on [Vercel](https://vercel.com).

## Getting started

Requires Node.js 18.18+ (see `.nvmrc`).

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build locally
npm run lint
```

## Project structure

```
index.html              Page shell: SEO meta, header, footer, SVG sprite
public/                 Static files served as-is (images, favicon, robots.txt, sitemap.xml)
src/
  main.js               Route table, page titles/meta, app start-up
  config.js             Site settings (email, Instagram, form backend)
  data/                 Products, colours, reviews, Indian states
  lib/                  Router, cart, form sending and validation, storage, formatting
  components/           Shared HTML pieces (product card, reviews, summary, order bar)
  pages/                One module per page
  styles/               Design tokens, base, layout, components, pages, motion
vercel.json             SPA rewrites, caching and security headers
```

Pages use clean URLs (`/shop`, `/journal-2027`, `/bag`, `/checkout`, `/story`, `/contact`, `/help`). Old `#hash` links from the single-file site redirect automatically.

## Orders and contact form

No payment is taken on the site. Orders and messages are emailed to hello@plantqi.com through [Web3Forms](https://web3forms.com).

1. Get a free access key at web3forms.com, sent to hello@plantqi.com.
2. In Vercel, open **Project → Settings → Environment Variables** and add `VITE_WEB3FORMS_KEY`.
3. Redeploy.

Until a key is set (and always on `localhost`), the site runs in **preview mode**: forms work, but nothing is sent, and the confirmation says so. See `.env.example` for the optional Google Sheet backend.

## Deployment

Every push to `main` deploys to production on Vercel, and pull requests get preview URLs. GitHub Actions (`.github/workflows/ci.yml`) runs lint and build on each push.
