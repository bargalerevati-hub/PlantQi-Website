// Small HTML building blocks shared across pages.
import { PRODUCTS, REVIEWS, SNAPS, img } from "../data/catalog.js";
import { esc, rupee } from "../lib/format.js";

export const bug = '<svg viewBox="0 0 100 100" aria-hidden="true"><use href="#ladybug"/></svg>';

const ARROW =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg>';

/** A CSS-drawn journal cover, used where there is no photo. */
export function coverHTML(colour, year, title = "The Quiet Growth We Overlook") {
  return `<div class="cover${colour.dark ? " cover--dark" : ""}" style="background:${colour.hex}"><b>${esc(title)}</b><small>${year}</small>${bug}</div>`;
}

export const KIDS_COVER = { hex: "#BFD8B8" };

export function productCard(id) {
  const p = PRODUCTS[id];
  let shot;
  if (id === "j27") shot = `<img class="contain" src="${img("cover27")}" width="1180" height="1617" alt="The 2027 journal">`;
  else if (id === "j26") shot = `<img src="${img("flat26")}" width="700" height="932" alt="The 2026 journal in four colours">`;
  else shot = coverHTML(KIDS_COVER, "2027", "Daily Journal for Kids");

  const badge =
    p.status === "preorder"
      ? '<span class="badge badge--new">Now ordering</span>'
      : p.status === "archive"
        ? '<span class="badge">First edition</span>'
        : '<span class="badge">Coming soon</span>';
  const price = p.price
    ? `<span class="price">${rupee(p.price)}</span>`
    : p.status === "archive"
      ? '<span class="muted">Sold out · where it all began</span>'
      : '<span class="muted">Join the waitlist</span>';

  return `<a class="product" href="/${p.route}"><div class="shot">${shot}</div>
    <div class="product-meta"><span class="label">${p.edition} edition</span>${badge}</div>
    <h3>${esc(p.name)}</h3><div class="product-meta product-meta--start">${price}</div></a>`;
}

export function reviewsHTML() {
  return (
    '<div class="reviews">' +
    REVIEWS.map(
      (r) =>
        `<figure class="review"><blockquote>“${esc(r.text)}”</blockquote><figcaption>${esc(r.name)} <span>· 2026 journal</span></figcaption></figure>`,
    ).join("") +
    "</div>"
  );
}

export function snapsHTML() {
  return (
    '<div class="snaps">' +
    SNAPS.map(
      ([key, caption]) =>
        `<figure><img src="${img(key)}" width="536" height="760" loading="lazy" alt="Inside the journal: ${esc(caption)}"><figcaption>${esc(caption)}</figcaption></figure>`,
    ).join("") +
    "</div>"
  );
}

export const RHYTHM = `<ul class="rhythm">
  <li><b>Daily</b><p>Pick a mood face and write whatever is on your mind. Two days a page, plenty of room.</p><small>5–10 min</small></li>
  <li><b>Weekly</b><p>A Sunday check-in: tick the habits you are growing.</p><small>2 min</small></li>
  <li><b>Monthly</b><p>A plan on the 1st, a full moon pause, a look back and a rating on the 29th.</p><small>15 min</small></li>
  <li><b>Yearly</b><p>A note to yourself and a bucket list in January. A look back in December.</p><small>30 min</small></li>
</ul>`;

export function nextUp(href, label, title, sub) {
  return `<a class="next-up" href="${href}"><span class="label">${label}</span><span class="t"><span>${title}</span>${ARROW}</span><p>${sub}</p></a>`;
}

export function specsHTML(specs) {
  return '<ul class="specs">' + specs.map(([k, v]) => `<li><span>${k}</span><span>${v}</span></li>`).join("") + "</ul>";
}

export function summaryHTML(t, actions = "") {
  return `<aside class="summary" aria-label="Order summary"><p class="label">Summary</p>
    <div class="row"><span>Subtotal</span><span class="price">${rupee(t.sub)}</span></div>
    <div class="row"><span>Delivery</span><span class="price">Included</span></div>
    <div class="row total"><span>Total</span><span class="price">${rupee(t.total)}</span></div>
    <p class="fine">No payment now. We send payment details on WhatsApp before dispatch.</p>${actions}</aside>`;
}

export function stepsHTML(current) {
  const steps = ["1 Bag", "2 Details", "3 Order placed"];
  return (
    '<div class="steps">' +
    steps.map((s, i) => `<span${i === current ? ' aria-current="step"' : ""}>${s}</span>`).join("") +
    "</div>"
  );
}

/** Adds a "Swipe →" hint after each horizontal strip (only visible on phones). */
export function addSwipeHints(root) {
  root.querySelectorAll(".inside, .year-glance, .reviews, .snaps").forEach((el) => {
    if (el.nextElementSibling?.classList.contains("swipe-hint")) return;
    const h = document.createElement("p");
    h.className = "swipe-hint";
    h.setAttribute("aria-hidden", "true");
    h.innerHTML = "Swipe " + ARROW;
    el.insertAdjacentElement("afterend", h);
  });
}
