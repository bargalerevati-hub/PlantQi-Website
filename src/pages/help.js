import { CONFIG, INSTAGRAM_URL } from "../config.js";
import { PRIVACY } from "../data/content.js";

const item = (id, heading, body) => `<section class="help-item" id="${id}"><h2>${heading}</h2>${body}</section>`;

export function pageHelp() {
  return `<div class="wrap"><div class="page-head"><p class="label">Help</p><h1>Orders, delivery and replacements</h1><p>Everything you need to know before you order.</p></div>
    <div class="help section-pad">
      ${item("help-payment", "Payment", "<p>No payment is taken on the website. After you place your order, we confirm it on WhatsApp. Before dispatch, we send you the payment details (UPI). Your journal ships once it is paid. Unpaid orders are cancelled after 3 days.</p>")}
      ${item("help-delivery", "Price and delivery", "<p>Prices include delivery anywhere in India. Journals ship in 3–5 working days after payment. We share a tracking link once your parcel is on its way.</p>")}
      ${item("help-replacement", "Returns and replacements", `<p>We do not accept returns. If your journal arrives damaged, we will replace it. Please write to us within 48 hours of delivery with a photo of the damage, at ${CONFIG.email} or through the contact form.</p>`)}
      ${item("help-privacy", "Your privacy", `<p>${PRIVACY}</p><p>We use Google Analytics to see which pages are visited and how people find us, so we can improve the site. It uses cookies and never receives your name, address or order details.</p>`)}
      ${item("help-contact", "Contact", `<p>Email <span class="select-all">${CONFIG.email}</span>, message us on Instagram at <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener">@${CONFIG.instagram}</a>, or use the <a href="/contact">contact form</a>.</p>`)}
    </div></div>`;
}
