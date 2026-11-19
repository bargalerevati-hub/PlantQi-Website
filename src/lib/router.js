// A small History API router: clean URLs (/shop, /journal-2027), animated page changes,
// and support for the old hash links (#shop) from the single-file version of the site.
const reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

export function createRouter({ routes, aliases = {}, notFound, outlet, onRender }) {
  let lastPath = null;
  const ctx = {
    navigate: (path, opts) => navigate(path, opts),
    refresh: () => render(location.pathname, false),
  };

  const normalise = (path) => {
    const p = path.replace(/\/+$/, "") || "/";
    return p.toLowerCase();
  };
  const resolve = (path) => routes[normalise(path)] || notFound;
  const isRoute = (path) => Boolean(routes[normalise(path)] || aliases[normalise(path)]);

  function render(path, animate) {
    const route = resolve(path);
    let out = route.page(ctx);
    if (typeof out === "string") out = { html: out };
    outlet.innerHTML = out.html;
    if (out.mount) out.mount(outlet);
    onRender(route, normalise(path));
    if (animate) {
      const parts = [];
      Array.from(outlet.children).forEach((c) => {
        if (c.classList.contains("wrap") && c.children.length) parts.push(...c.children);
        else parts.push(c);
      });
      parts.slice(0, 8).forEach((el, i) => {
        el.classList.add("enter");
        el.style.animationDelay = i * 70 + "ms";
      });
    }
  }

  function show(path, { scrollTo } = {}) {
    const alias = aliases[normalise(path)];
    if (alias) {
      history.replaceState(null, "", alias + location.search + location.hash);
      path = alias;
    }
    const first = lastPath === null;
    const same = lastPath === normalise(path);
    lastPath = normalise(path);
    const after = () => {
      if (scrollTo) {
        const el = document.getElementById(scrollTo);
        if (el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      } else if (!first && !same) window.scrollTo(0, 0);
    };
    if (first || same || reduceMotion) {
      render(path, false);
      after();
      return;
    }
    outlet.classList.add("leaving");
    setTimeout(() => {
      render(path, true);
      after();
      outlet.classList.remove("leaving");
      outlet.focus({ preventScroll: true });
    }, 200);
  }

  function navigate(path, opts = {}) {
    if (normalise(path) === lastPath && !opts.scrollTo && !opts.force) {
      window.scrollTo(0, 0);
      return;
    }
    if (opts.replace) history.replaceState(null, "", path);
    else history.pushState(null, "", path);
    show(path, opts);
  }

  function start() {
    document.addEventListener("click", (e) => {
      if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !isRoute(url.pathname)) return;
      e.preventDefault();
      navigate(url.pathname, { scrollTo: a.dataset.to });
    });
    window.addEventListener("popstate", () => show(location.pathname));

    // Old single-file links like plantqi.com/#journal-2027 become /journal-2027.
    const legacy = location.hash.slice(1);
    if (legacy && isRoute("/" + legacy)) {
      history.replaceState(null, "", "/" + legacy.toLowerCase() + location.search);
    }
    show(location.pathname);
  }

  return { start, navigate };
}
