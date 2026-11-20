// Runs after `vite build`. Saves each public page as finished HTML (so search engines see the
// full content without running JavaScript), writes the app shell for other paths, and sitemap.xml.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { notFound, routes } from "../src/routes.js";
import { ORIGIN, canonical, headTags } from "../src/seo.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const SEO_BLOCK = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/;
const MAIN = /(<main id="app" tabindex="-1">)[\s\S]*?(<\/main>)/;

const template = readFileSync(join(dist, "index.html"), "utf8");
if (!SEO_BLOCK.test(template) || !MAIN.test(template)) {
  throw new Error("prerender: dist/index.html is missing the seo markers or <main id=\"app\">");
}

const vercel = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
const rewriteFor = (source) => vercel.rewrites.find((r) => r.source === source)?.destination;

const fileFor = (path) => (path === "/" ? "index.html" : `pages${path}.html`);

function render(route, path, { noindex = false, body } = {}) {
  let html = template.replace(SEO_BLOCK, headTags(route, path, { noindex }));
  if (body !== undefined) html = html.replace(MAIN, (_, open, close) => `${open}\n${body}\n${close}`);
  if (route.nav) html = html.replaceAll(`data-nav="${route.nav}"`, `data-nav="${route.nav}" aria-current="page"`);
  return html;
}

// App shell for cart pages, old links and unknown paths: no page content, not indexed.
writeFileSync(join(dist, "app.html"), render(notFound, "/", { noindex: true }));

mkdirSync(join(dist, "pages"), { recursive: true });
const pages = Object.entries(routes).filter(([, r]) => r.prerender);
for (const [path, route] of pages) {
  const file = fileFor(path);
  if (path !== "/" && rewriteFor(path) !== "/" + file) {
    throw new Error(`prerender: vercel.json needs { "source": "${path}", "destination": "/${file}" }`);
  }
  let out = route.page();
  if (typeof out === "string") out = { html: out };
  writeFileSync(join(dist, file), render(route, path, { body: out.html }));
  console.log(`prerendered ${path} → ${file}`);
}

const today = new Date().toISOString().slice(0, 10);
const urls = pages
  .map(([path]) => `  <url><loc>${canonical(path)}</loc><lastmod>${today}</lastmod></url>`)
  .join("\n");
writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
console.log(`sitemap.xml: ${pages.length} pages on ${ORIGIN}`);
