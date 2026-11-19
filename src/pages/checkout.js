import { CONFIG } from "../config.js";
import { PRIVACY, STATES } from "../data/content.js";
import { cart, lineAmount, lineName } from "../lib/cart.js";
import { esc, rupee } from "../lib/format.js";
import { isEmail, isIndianMobile, isPin, sendForm, showErrors } from "../lib/forms.js";
import { store } from "../lib/storage.js";
import { stepsHTML, summaryHTML } from "../components/ui.js";

const FIELDS = ["name", "phone", "email", "address1", "address2", "landmark", "city", "state", "pin", "note"];

const LOCK =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

function orderId(now) {
  const pad = (n) => String(n).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PQ-${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${rand}`;
}

export function pageCheckout({ navigate }) {
  if (cart.isEmpty()) {
    setTimeout(() => navigate("/bag", { replace: true, force: true }), 0);
    return "";
  }
  const d = store.get("pq-details", {});
  const f = (id, label, type, extra = "", full = false) =>
    `<div class="field${full ? " full" : ""}"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" value="${esc(d[id] || "")}" ${extra}><span class="err" id="${id}-err"></span></div>`;
  const stateSel = `<div class="field"><label for="state">State</label><select id="state" name="state" autocomplete="address-level1" required><option value="">Choose your state</option>${STATES.map(
    (x) => `<option${d.state === x ? " selected" : ""}>${x}</option>`,
  ).join("")}</select><span class="err" id="state-err"></span></div>`;

  const items =
    '<ul class="summary-lines">' +
    cart
      .lines()
      .map((l) => `<li><span>${esc(lineName(l))} × ${l.qty}</span><span class="price">${rupee(lineAmount(l))}</span></li>`)
      .join("") +
    '</ul><a class="link" href="/bag">Edit bag</a>';

  const html = `<div class="wrap"><div class="page-head"><p class="label">Checkout</p><h1>Delivery details</h1><p>No payment now. Place your order, and we will send payment details on WhatsApp before we dispatch.</p></div>
    ${stepsHTML(1)}
    <div class="two-col"><form id="checkout" novalidate class="stack gap-28">
      <div class="form-grid">
        ${f("name", "Full name", "text", 'autocomplete="name" required', true)}
        ${f("phone", "Mobile (WhatsApp)", "tel", 'autocomplete="tel" inputmode="numeric" placeholder="10-digit number" required')}
        ${f("email", "Email", "email", 'autocomplete="email" required')}
        ${f("address1", "Flat / house no. and building", "text", 'autocomplete="address-line1" required', true)}
        ${f("address2", "Street and area", "text", 'autocomplete="address-line2" required', true)}
        ${f("landmark", "Landmark (optional)", "text")}
        ${f("city", "City", "text", 'autocomplete="address-level2" required')}
        ${stateSel}
        ${f("pin", "PIN code", "text", 'inputmode="numeric" autocomplete="postal-code" placeholder="6 digits" required')}
        <div class="field full"><label for="note">Note for us (optional)</label><textarea id="note" name="note" placeholder="Buying as a gift? Add a message. Or a delivery time, anything else.">${esc(d.note || "")}</textarea></div>
      </div>
      <div class="pay-opt"><span><b>How payment works</b><span>Before we dispatch, we message you on WhatsApp with the payment details (UPI). Your journal ships once it is paid. Unpaid orders are cancelled after 3 days.</span></span></div>
      <p class="muted small privacy-note">${LOCK}<span>${PRIVACY}</span></p>
      <button class="btn" type="submit" id="place">Place order</button><p class="err" id="send-err" role="alert"></p>
    </form>${summaryHTML(cart.totals(), items)}</div></div>`;

  return {
    html,
    mount() {
      const form = document.getElementById("checkout");
      const btn = document.getElementById("place");
      const sendErr = document.getElementById("send-err");
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const v = {};
        FIELDS.forEach((k) => (v[k] = (form.elements[k].value || "").trim()));
        const { note: _note, ...remembered } = v;
        store.set("pq-details", remembered);

        const ok = showErrors({
          name: v.name.length < 2 ? "Please enter your full name." : "",
          phone: !isIndianMobile(v.phone) ? "Enter a 10-digit Indian mobile number." : "",
          email: !isEmail(v.email) ? "Enter an email address like name@example.com." : "",
          address1: v.address1.length < 2 ? "Please enter your flat or house number." : "",
          address2: v.address2.length < 3 ? "Please enter your street and area." : "",
          city: !v.city ? "Please enter your city." : "",
          state: !v.state ? "Please choose your state." : "",
          pin: !isPin(v.pin) ? "Enter a 6-digit PIN code." : "",
        });
        if (!ok) return;

        const now = new Date();
        const id = orderId(now);
        const order = {
          id,
          lines: cart.lines().map((l) => ({ name: lineName(l), qty: l.qty, amount: lineAmount(l) })),
          totals: cart.totals(),
          customer: v,
          at: now.toISOString(),
        };
        btn.disabled = true;
        btn.textContent = "Placing order…";
        sendErr.textContent = "";
        try {
          const how = await sendForm("order", {
            "order-id": id,
            items: order.lines.map((l) => `${l.name} x ${l.qty} = Rs ${l.amount}`).join("; "),
            total: "Rs " + order.totals.total,
            name: v.name,
            phone: v.phone,
            email: v.email,
            address: [v.address1, v.address2, v.landmark].filter(Boolean).join(", "),
            city: v.city,
            state: v.state,
            pin: v.pin,
            note: v.note,
          });
          order.preview = how === "preview";
          store.set("pq-last-order", order);
          cart.clear();
          navigate("/order-placed");
        } catch {
          btn.disabled = false;
          btn.textContent = "Place order";
          sendErr.textContent = `Your order could not be sent. Please try again, or email it to ${CONFIG.email}.`;
        }
      });
    },
  };
}
