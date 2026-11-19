import { CONFIG } from "../config.js";
import { PRODUCTS, colourById, img } from "../data/catalog.js";
import { cart, lineAmount, lineName } from "../lib/cart.js";
import { esc, rupee } from "../lib/format.js";
import { coverHTML, summaryHTML } from "../components/ui.js";

function lineThumb(l) {
  if (l.id === "j26") return coverHTML(colourById(l.colour), "2026");
  return `<img src="${img("cover27")}" alt="">`;
}

export function pageBag({ refresh }) {
  if (cart.isEmpty()) {
    return `<div class="wrap"><div class="page-head"><p class="label">Your bag</p><h1>Your bag is empty</h1></div>
      <div class="empty"><p class="muted">The 2027 journal is open for orders.</p><a class="btn" href="/shop">Browse journals</a></div></div>`;
  }
  const lines = cart
    .lines()
    .map((l, i) => {
      const p = PRODUCTS[l.id];
      return `<li class="line"><div class="thumb">${lineThumb(l)}</div><div><h3>${esc(lineName(l))}</h3>
        <p class="sub">${p.status === "preorder" ? CONFIG.ships2027 : CONFIG.ships2026}</p>
        <div class="controls"><div class="qty" role="group" aria-label="Quantity"><button type="button" data-line="${i}" data-d="-1" aria-label="One less">−</button><span>${l.qty}</span><button type="button" data-line="${i}" data-d="1" aria-label="One more">+</button></div>
        <button class="link" type="button" data-remove="${i}">Remove</button></div></div>
        <span class="price">${rupee(lineAmount(l))}</span></li>`;
    })
    .join("");

  return {
    html: `<div class="wrap"><div class="page-head"><p class="label">Your bag</p><h1>Your bag</h1></div>
      <div class="two-col"><ul class="lines">${lines}</ul>${summaryHTML(
        cart.totals(),
        '<a class="btn btn--block" href="/checkout">Continue to delivery details</a><a class="link" href="/shop" style="justify-self:center">Keep shopping</a>',
      )}</div></div>`,
    mount(root) {
      root.querySelectorAll("[data-d]").forEach((b) =>
        b.addEventListener("click", () => {
          cart.changeQty(+b.dataset.line, +b.dataset.d);
          refresh();
        }),
      );
      root.querySelectorAll("[data-remove]").forEach((b) =>
        b.addEventListener("click", () => {
          cart.remove(+b.dataset.remove);
          refresh();
        }),
      );
    },
  };
}
