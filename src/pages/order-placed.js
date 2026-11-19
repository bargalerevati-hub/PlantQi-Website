import { CONFIG } from "../config.js";
import { esc, firstName, rupee } from "../lib/format.js";
import { store } from "../lib/storage.js";
import { stepsHTML } from "../components/ui.js";

export function pageOrderPlaced() {
  const o = store.get("pq-last-order", null);
  if (!o) {
    return '<div class="wrap"><div class="empty"><h1>No recent order</h1><a class="btn" href="/shop">Browse journals</a></div></div>';
  }
  const c = o.customer;
  const lines = o.lines
    .map((l) => `<li><span>${esc(l.name)} × ${l.qty}</span><span class="price">${rupee(l.amount)}</span></li>`)
    .join("");
  const ships = CONFIG.ships2027.charAt(0).toLowerCase() + CONFIG.ships2027.slice(1);
  const pre = o.lines.some((l) => /2027/.test(l.name)) ? ` Your journal ${ships} after payment.` : "";
  const address = [c.address1, c.address2, c.landmark, c.city, c.state + " " + c.pin].filter(Boolean).join(", ");

  return `<div class="wrap"><div class="confirm"><p class="label">Order placed</p><h1>Thank you, ${esc(firstName(c.name))}.</h1>
    <p>Your order number is <span class="order-id">${esc(o.id)}</span></p>
    ${o.preview ? `<p class="muted small preview-note">Preview only: once the site's form key is set, this order is sent to ${CONFIG.email}.</p>` : ""}
    ${stepsHTML(2)}
    <ol class="next-steps">
      <li><span>We have your order. We will confirm it on WhatsApp at ${esc(c.phone)} within a day.</span></li>
      <li><span>Before dispatch, we send the payment details (UPI) for ${rupee(o.totals.total)} on WhatsApp.</span></li>
      <li><span>Once paid, we pack your journal and share the tracking link.${pre}</span></li>
    </ol>
    <aside class="summary"><p class="label">Your order</p><ul class="summary-lines">${lines}</ul>
      <div class="row"><span>Delivery</span><span>Included</span></div>
      <div class="row total"><span>Total</span><span class="price">${rupee(o.totals.total)}</span></div>
      <p class="fine">Delivering to ${esc(address)}</p></aside>
    <p class="muted small">Questions? Write to <span class="select-all">${CONFIG.email}</span>.</p>
    <a class="link" href="/shop">Back to journals</a></div></div>`;
}
