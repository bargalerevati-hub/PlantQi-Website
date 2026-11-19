// The sticky "Order" bar on phones: appears once the main order button scrolls out of view.
const reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
let observer = null;

export function setupBuybar(path, outlet) {
  const bar = document.getElementById("buybar");
  const link = bar.querySelector("a");
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  const show = (on) => {
    bar.classList.toggle("show", on);
    bar.setAttribute("aria-hidden", on ? "false" : "true");
    link.tabIndex = on ? 0 : -1;
    document.body.classList.toggle("has-buybar", on);
  };
  show(false);
  if (path !== "/" && path !== "/journal-2027") return;

  const target = path === "/" ? outlet.querySelector(".q-hero .actions") : document.getElementById("add");
  if (!target || !("IntersectionObserver" in window)) return;

  link.onclick =
    path === "/journal-2027"
      ? (e) => {
          e.preventDefault();
          const add = document.getElementById("add");
          if (add) {
            add.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
            add.focus({ preventScroll: true });
          }
        }
      : null;

  observer = new IntersectionObserver((entries) => {
    show(!entries[0].isIntersecting && entries[0].boundingClientRect.top < 0);
  });
  observer.observe(target);
}
