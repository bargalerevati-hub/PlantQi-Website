import { CONFIG, INSTAGRAM_URL } from "../config.js";
import { COLOURS, PRODUCTS, colourById, img } from "../data/catalog.js";
import { cart, clampQty } from "../lib/cart.js";
import { esc, rupee } from "../lib/format.js";
import { KIDS_COVER, RHYTHM, coverHTML, reviewsHTML, snapsHTML, specsHTML } from "../components/ui.js";

function buyPanel(id, p) {
  if (p.status === "archive") {
    return `<p class="muted">${esc(p.blurb)}</p><p>Our first edition has sold out. Thank you to everyone who wrote in it.</p>
      <div class="actions"><a class="btn" href="/journal-2027">See the 2027 journal</a></div>${specsHTML(p.specs)}`;
  }
  if (p.status === "soon") {
    return `<p class="muted">${esc(p.blurb)}</p><p>Not ready to order yet. We will share the launch date on Instagram first.</p>
      <a class="btn" href="${INSTAGRAM_URL}" target="_blank" rel="noopener">Follow @${CONFIG.instagram} for the launch</a>`;
  }
  const swatches = p.colours
    ? `<div class="stack gap-10"><span class="label">Colour: <span id="colour-name">${COLOURS[0].name}</span></span>
        <div class="swatches" role="radiogroup" aria-label="Colour">${COLOURS.map(
          (c, i) =>
            `<button type="button" class="swatch" role="radio" aria-checked="${i === 0}" data-colour="${c.id}"><i style="background:${c.hex}"></i>${c.name.split(" ")[0]}</button>`,
        ).join("")}</div></div>`
    : "";
  return `<p class="muted">${esc(p.blurb)}</p>
    <div class="price">${rupee(p.price)}</div>${swatches}
    <div class="add-row"><div class="qty" role="group" aria-label="Quantity"><button type="button" data-q="-1" aria-label="One less">−</button><span id="qty" aria-live="polite">1</span><button type="button" data-q="1" aria-label="One more">+</button></div>
      <button class="btn" type="button" id="add">${p.status === "preorder" ? "Order" : "Add to bag"}</button></div>
    <p class="added" id="added" aria-live="polite"></p>
    <p class="muted small">${id === "j27" ? CONFIG.ships2027 : CONFIG.ships2026} · Price includes delivery across India · <a href="/help">Replacements</a></p>
    ${id === "j27" ? '<p class="gift-hint small">Buying it as a gift? Add a message in the note at checkout. For teams, <a href="/contact">write to us</a>.</p>' : ""}
    ${specsHTML(p.specs)}`;
}

function extraSections(id) {
  if (id === "j27") {
    return `<section class="section"><div class="stack gap-28"><div class="stack"><p class="label">How it works</p><h2>A rhythm for the whole year</h2></div>${RHYTHM}${snapsHTML()}</div></section>`;
  }
  if (id === "j26") {
    return `<section class="section"><div class="stack gap-28"><div class="stack"><p class="label">What readers said</p><h2>Loved in 2026</h2></div>${reviewsHTML()}</div></section>
      <section class="section"><div class="stack gap-28"><div class="stack"><p class="label">Look inside</p><h2>Ten minutes a day, three simple rhythms</h2></div>
        <div class="inside">
          <figure><img src="${img("sDay26")}" width="900" height="711" loading="lazy" alt="Month plan and daily pages from the 2026 journal"><figcaption>Reflect on your day</figcaption></figure>
          <figure><img src="${img("sWeek26")}" width="900" height="650" loading="lazy" alt="Weekly habit tracker and month review"><figcaption>Reflect on your week and month</figcaption></figure>
          <figure><img src="${img("sHab26")}" width="900" height="647" loading="lazy" alt="Prompts and the yearly exercise tracker"><figcaption>Track your yearly habits</figcaption></figure>
        </div></div></section>`;
  }
  return "";
}

export function pageProduct(id) {
  const p = PRODUCTS[id];
  const imgs = (p.images || []).map(img);
  const state = { colour: COLOURS[0].id, qty: 1 };

  const main =
    id === "k27"
      ? `<div class="main">${coverHTML(KIDS_COVER, "2027", "Daily Journal for Kids")}</div>`
      : `<div class="main"><img id="main-img" src="${imgs[0]}" alt="${esc(p.name)}"${id === "j26" ? ' class="cover-photo"' : ""}></div>`;
  const thumbs =
    imgs.length > 1
      ? '<div class="thumbs" role="group" aria-label="More photos">' +
        imgs
          .map(
            (src, i) =>
              `<button type="button" data-thumb="${i}" aria-pressed="${i === 0}" aria-label="Photo ${i + 1}"><img src="${src}" alt="" loading="lazy"></button>`,
          )
          .join("") +
        "</div>"
      : "";

  const html = `<div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="/shop">Journals</a> / ${esc(p.short)}</nav>
    <div class="pdp"><div class="gallery">${main}${thumbs}</div>
      <div class="buy"><div class="stack gap-10"><p class="label">${p.edition} edition</p><h1 class="pdp-title">${esc(p.name)}</h1></div>${buyPanel(id, p)}</div></div>
    ${extraSections(id)}</div>`;

  return {
    html,
    mount(root) {
      root.querySelectorAll("[data-thumb]").forEach((b) =>
        b.addEventListener("click", () => {
          document.getElementById("main-img").src = imgs[+b.dataset.thumb];
          root.querySelectorAll("[data-thumb]").forEach((x) => x.setAttribute("aria-pressed", x === b));
        }),
      );
      root.querySelectorAll("[data-colour]").forEach((b) =>
        b.addEventListener("click", () => {
          state.colour = b.dataset.colour;
          document.getElementById("colour-name").textContent = colourById(state.colour).name;
          root.querySelectorAll("[data-colour]").forEach((x) => x.setAttribute("aria-checked", x === b));
        }),
      );
      root.querySelectorAll("[data-q]").forEach((b) =>
        b.addEventListener("click", () => {
          state.qty = clampQty(state.qty + +b.dataset.q);
          document.getElementById("qty").textContent = state.qty;
        }),
      );
      const add = document.getElementById("add");
      if (add)
        add.addEventListener("click", () => {
          cart.add(id, p.colours ? state.colour : null, state.qty);
          document.getElementById("added").innerHTML = 'Added to your bag. <a href="/bag">View bag</a>';
        });
    },
  };
}
