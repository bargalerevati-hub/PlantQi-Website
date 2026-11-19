import { nextUp, productCard } from "../components/ui.js";

export function pageShop() {
  return `<div class="wrap">
    <div class="page-head"><p class="label">Shop</p><h1>Journals</h1><p>A calm, well-made journal for the year ahead.</p></div>
    <section class="section-pad"><div class="edition-head"><h2>This year 2027</h2><span class="muted">Ships in 3–5 working days</span></div>
      <div class="products">${productCard("j27")}</div></section>
    ${nextUp("/contact", "Gifting or bulk", "Write to us", "For your team, a Secret Santa, a school or an event.")}
  </div>`;
}
