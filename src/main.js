import { setupBuybar } from "./components/buybar.js";
import { addSwipeHints } from "./components/ui.js";
import { cart } from "./lib/cart.js";
import { createRouter } from "./lib/router.js";
import { notFound, routes } from "./routes.js";
import { DEFAULT_DESCRIPTION, canonical, pageTitle } from "./seo.js";

// Older page names from the single-file site (also redirected by vercel.json).
const aliases = { "/home": "/", "/journals": "/shop", "/about": "/story", "/about-contact": "/contact" };

function setMeta(route, path) {
  document.title = pageTitle(route, path);
  document.querySelector('meta[name="description"]').setAttribute("content", route.description || DEFAULT_DESCRIPTION);

  let link = document.querySelector('link[rel="canonical"]');
  let robots = document.querySelector('meta[name="robots"]');
  if (route.noindex) {
    link?.remove();
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      robots.content = "noindex";
      document.head.append(robots);
    }
  } else {
    robots?.remove();
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.append(link);
    }
    link.href = canonical(path);
  }
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
