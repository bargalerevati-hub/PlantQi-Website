// Search-engine metadata: page <head> tags and structured data (JSON-LD).
// Used by the browser app on navigation and by scripts/prerender.js at build time.
import { CONFIG, INSTAGRAM_URL } from "./config.js";
import { PRODUCTS, REVIEWS } from "./data/catalog.js";
import { esc } from "./lib/format.js";

export const ORIGIN = "https://www.plantqi.com";
export const SITE = "Plant Qi";
export const DEFAULT_TITLE = "Plant Qi · 2027 Daily Journal, A5 Hardcover · Made in India";
export const DEFAULT_DESCRIPTION =
  "Plant Qi makes calm, well-made daily journals in India. The 2027 A5 hardcover journal has open daily pages, monthly plans and habit trackers. ₹699 with free delivery across India.";
const DEFAULT_IMAGE = "/images/cover27.webp";

export const pageTitle = (route, path) => (path === "/" ? route.title : `${route.title} · ${SITE}`);
export const canonical = (path) => ORIGIN + (path === "/" ? "/" : path);

/** The SEO block of <head> for a page, as HTML. */
export function headTags(route, path, { noindex = false } = {}) {
  const title = esc(noindex ? DEFAULT_TITLE : pageTitle(route, path));
  const description = esc(route.description || DEFAULT_DESCRIPTION);
  const url = canonical(path);
  const image = ORIGIN + (route.image || DEFAULT_IMAGE);
  const schema = !noindex && route.schema ? route.schema() : [];
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    noindex ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    noindex ? "" : `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    ...schema.map(
      (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`,
    ),
  ]
    .filter(Boolean)
    .join("\n    ");
}

/* ---------- structured data ---------- */
const brand = { "@type": "Brand", name: SITE };

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE,
  url: ORIGIN + "/",
  logo: ORIGIN + "/favicon.svg",
  email: CONFIG.email,
  sameAs: [INSTAGRAM_URL],
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE,
  url: ORIGIN + "/",
});

function breadcrumbs(product) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Journals", item: ORIGIN + "/shop" },
      { "@type": "ListItem", position: 2, name: product.short, item: ORIGIN + "/" + product.route },
    ],
  };
}

export function productSchema(id) {
  const p = PRODUCTS[id];
  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.blurb,
    image: (p.images || []).map((k) => `${ORIGIN}/images/${k}.webp`),
    brand,
    sku: "PQ-" + id.toUpperCase(),
    category: "Journals & Planners",
  };
  if (p.price) {
    product.offers = {
      "@type": "Offer",
      url: ORIGIN + "/" + p.route,
      priceCurrency: "INR",
      price: String(p.price),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "INR" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
      },
    };
  }
  // The reader reviews are for the 2026 edition, so they only appear on that product.
  if (id === "j26") {
    product.review = REVIEWS.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewBody: r.text,
    }));
  }
  return [product, breadcrumbs(p)];
}
