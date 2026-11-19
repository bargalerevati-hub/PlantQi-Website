import { CONFIG } from "../config.js";

const LABELS = {
  "order-id": "Order ID", items: "Items", total: "Total", name: "Name", phone: "Phone (WhatsApp)", email: "Email",
  address: "Address", city: "City", state: "State", pin: "PIN code", note: "Note", message: "Message",
};

const isLocal = () => /^(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)$/.test(location.hostname);

/**
 * Which backend receives submissions. Returns null (preview mode: nothing is sent) on local
 * development or when the chosen backend isn't configured.
 */
function activeBackend() {
  if (isLocal()) return null;
  if (CONFIG.backend === "sheet") return /^https:\/\/script\.google\.com\/.+\/exec$/.test(CONFIG.sheetUrl) ? "sheet" : null;
  if (CONFIG.backend === "email") return /^[0-9a-f-]{30,}$/i.test(CONFIG.web3formsKey) ? "email" : null;
  return null;
}

/** Send a named form. Resolves "sent" or "preview"; rejects when sending fails. */
export async function sendForm(name, data) {
  const backend = activeBackend();
  if (!backend) return "preview";

  if (backend === "email") {
    const mail = {
      access_key: CONFIG.web3formsKey,
      from_name: "Plant Qi website",
      subject: name === "order" ? `New order ${data["order-id"]} from ${data.name}` : `New message from ${data.name}`,
    };
    if (data.email) mail.replyto = data.email;
    Object.keys(data).forEach((k) => (mail[LABELS[k] || k] = data[k] || "-"));
    const r = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(mail),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.success === false) throw new Error("send failed");
    return "sent";
  }

  // Google's reply is not readable cross-origin, so a network failure is the only error we can see.
  await fetch(CONFIG.sheetUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: new URLSearchParams({ "form-name": name, ...data }).toString(),
  });
  return "sent";
}

/* ---------- validation ---------- */
export const isIndianMobile = (v) => /^(\+?91)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, ""));
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isPin = (v) => /^[1-9]\d{5}$/.test(v);

/**
 * Show field errors next to inputs (element ids match keys; error text goes in `${id}-err`).
 * Focuses the first invalid field and returns true when everything is valid.
 */
export function showErrors(errs) {
  let first = null;
  Object.keys(errs).forEach((id) => {
    const el = document.getElementById(id);
    document.getElementById(id + "-err").textContent = errs[id];
    if (errs[id]) {
      el.setAttribute("aria-invalid", "true");
      first = first || el;
    } else el.removeAttribute("aria-invalid");
  });
  if (first) first.focus();
  return !first;
}
