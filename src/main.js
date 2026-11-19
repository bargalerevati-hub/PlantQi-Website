import { setupBuybar } from "./components/buybar.js";
import { addSwipeHints } from "./components/ui.js";
import { PRODUCTS } from "./data/catalog.js";
import { cart } from "./lib/cart.js";
import { createRouter } from "./lib/router.js";
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

const SITE = "Plant Qi";
const ORIGIN = "https://plantqi.com";
const DEFAULT_DESCRIPTION = "Small steps. Quiet growth. Calm, well-made journals by Plant Qi, made with care in India.";

const product = (id) => ({
  page: () => pageProduct(id),
  title: PRODUCTS[id].name,
  description: PRODUCTS[id].blurb,
  nav: "shop",
});

const routes = {
  "/": { page: pageHome, title: "Plant Qi · Journals for small, steady change" },
  "/shop": { page: pageShop, title: "Journals", nav: "shop", description: "A calm, well-made journal for the year ahead." },
  "/journal-2027": product("j27"),
  "/journal-2026": product("j26"),
  "/bag": { page: pageBag, title: "Your bag", nav: "bag" },
  "/checkout": { page: pageCheckout, title: "Checkout", nav: "bag" },
  "/order-placed": { page: pageOrderPlaced, title: "Order placed", nav: "bag" },
  "/story": {
    page: pageStory,
    title: "Our story",
    nav: "story",
    description: "We started with one question: how little do we really need?",
  },
  "/contact": {
    page: pageContact,
    title: "Contact",
    nav: "contact",
    description: "Questions about an order, gifting or bulk journals? Write to Plant Qi.",
  },
  "/help": {
    page: pageHelp,
    title: "Orders, delivery and replacements",
    description: "Payment, delivery across India and replacements for Plant Qi journals.",
  },
};

// Older page names from the single-file site.
const aliases = { "/home": "/", "/journals": "/shop", "/about": "/story", "/about-contact": "/contact" };

const notFound = { page: pageNotFound, title: "Page not found" };

function setMeta(route, path) {
  document.title = path === "/" ? route.title : `${route.title} · ${SITE}`;
  document.querySelector('meta[name="description"]').setAttribute("content", route.description || DEFAULT_DESCRIPTION);
  document.querySelector('link[rel="canonical"]').setAttribute("href", ORIGIN + (path === "/" ? "/" : path));
}

const outlet = document.getElementById("app");
const router = createRouter({
  routes,
  aliases,
  notFound,
  outlet,
  onRender(route, path) {
    setMeta(route, path);
    setupBuybar(path, outlet);
    addSwipeHints(outlet);
    document.querySelectorAll("[data-nav]").forEach((a) => {
      if (a.dataset.nav === route.nav) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  },
});

const updateCount = () => (document.getElementById("bag-count").textContent = cart.count());
cart.subscribe(updateCount);
updateCount();
document.getElementById("year").textContent = new Date().getFullYear();

router.start();
