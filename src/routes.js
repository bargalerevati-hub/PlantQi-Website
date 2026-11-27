// Every page of the site: how to render it and its search metadata.
// `prerender: true` pages are saved as static HTML at build time (see scripts/prerender.js).
import { PRODUCTS } from "./data/catalog.js";
import { organizationSchema, productSchema, websiteSchema } from "./seo.js";
import { pageBag } from "./pages/bag.js";
import { pageCheckout } from "./pages/checkout.js";
import { pageContact } from "./pages/contact.js";
import { pageHelp } from "./pages/help.js";
import { pageHome } from "./pages/home.js";
import { pageNotFound } from "./pages/not-found.js";
import { pageOrderPlaced } from "./pages/order-placed.js";
import { pageProduct } from "./pages/product.js";
import { pageShop } from "./pages/shop.js";
import { pageStory } from "./pages/story.js";

const product = (id, title, description) => ({
  page: () => pageProduct(id),
  title,
  description,
  image: `/images/${PRODUCTS[id].images[0]}.webp`,
  nav: "shop",
  prerender: true,
  schema: () => productSchema(id),
});

export const routes = {
  "/": {
    page: pageHome,
    title: "Plant Qi · 2027 Daily Journal, A5 Hardcover · Made in India",
    description:
      "A calm 2027 daily journal: A5 hardcover, cream paper, open daily pages, monthly plans and habit trackers. Made in India by Plant Qi. ₹699 with free delivery.",
    prerender: true,
    schema: () => [organizationSchema(), websiteSchema()],
  },
  "/shop": {
    page: pageShop,
    title: "Daily Journals for 2027",
    description:
      "Shop Plant Qi daily journals: the 2027 A5 hardcover journal with mood tracking, habit trackers and monthly reviews. Free delivery across India.",
    nav: "shop",
    prerender: true,
  },
  "/journal-2027": product(
    "j27",
    "2027 Daily Journal, A5 Hardcover · ₹699",
    "The Quiet Growth We Overlook 2027: an A5 hardcover daily journal with 224 cream pages, two days a page, mood faces, monthly plans and a Sunday habit tracker. ₹699, free delivery in India.",
  ),
  "/journal-2026": product(
    "j26",
    "2026 Daily Journal (First Edition, Sold Out)",
    "Plant Qi's first daily journal, the 2026 edition in rose pink, sunshine yellow, ocean blue and stone grey. Now sold out: see the 2027 journal.",
  ),
  "/story": {
    page: pageStory,
    title: "Our Story",
    nav: "story",
    description:
      "Plant Qi began with one question: how little do we really need? The story behind our daily journal and the ladybug on its cover.",
    prerender: true,
  },
  "/contact": {
    page: pageContact,
    title: "Contact · Bulk and Gift Orders",
    nav: "contact",
    description:
      "Questions about an order, corporate gifting or bulk journals for your team? Write to Plant Qi and we'll reply within a day.",
    prerender: true,
  },
  "/help": {
    page: pageHelp,
    title: "Orders, Delivery and Replacements",
    description:
      "How ordering works at Plant Qi: pay by UPI before dispatch, free delivery anywhere in India in 3–5 working days, and replacements for damaged journals.",
    prerender: true,
  },
  "/bag": { page: pageBag, title: "Your bag", nav: "bag", noindex: true },
  "/checkout": { page: pageCheckout, title: "Checkout", nav: "bag", noindex: true },
  "/order-placed": { page: pageOrderPlaced, title: "Order placed", nav: "bag", noindex: true },
};

export const notFound = { page: pageNotFound, title: "Page not found", noindex: true };
