// POST /api/order: validates an order against the catalogue, saves it to the orders sheet,
// and returns the confirmed order. Prices always come from the server, never the browser.
import { PRODUCTS, colourById } from "../src/data/catalog.js";
import { checkCustomer } from "../src/lib/validate.js";
import { clean, methodNotAllowed, nowIST, readBody, saveToSheet } from "./_lib/sheet.js";

const CUSTOMER_FIELDS = ["name", "phone", "email", "address1", "address2", "landmark", "city", "state", "pin", "note"];
const MAX_QTY = 20;

function orderId() {
  const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const pad = (n) => String(n).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PQ-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${rand}`;
}

function priceLines(items) {
  if (!Array.isArray(items) || !items.length || items.length > 10) return null;
  const lines = [];
  for (const item of items) {
    const p = PRODUCTS[item?.id];
    const qty = Number(item?.qty);
    if (!p || !p.price || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) return null;
    const colour = p.colours ? colourById(item.colour).name : "";
    lines.push({
      name: p.short + (colour ? ", " + colour : ""),
      qty,
      amount: p.price * qty,
    });
  }
  return lines;
}

export default async function handler(req, res) {
  if (methodNotAllowed(req, res)) return;
  const body = readBody(req);

  // Honeypot: real visitors never fill the hidden "company" field.
  if (body.company) return res.status(200).json({ ok: true, id: "PQ-0" });

  const c = clean(body.customer, CUSTOMER_FIELDS);
  const errors = Object.fromEntries(Object.entries(checkCustomer(c)).filter(([, msg]) => msg));
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, error: "invalid", errors });

  const lines = priceLines(body.items);
  if (!lines) return res.status(400).json({ ok: false, error: "Your bag has an item we can't sell right now." });

  const total = lines.reduce((a, l) => a + l.amount, 0);
  const id = orderId();
  try {
    await saveToSheet("order", {
      "Order ID": id,
      Date: nowIST(),
      Status: "New",
      Items: lines.map((l) => `${l.name} × ${l.qty}`).join("; "),
      "Total (₹)": total,
      Name: c.name,
      "Phone (WhatsApp)": c.phone,
      Email: c.email,
      Address: [c.address1, c.address2, c.landmark].filter(Boolean).join(", "),
      City: c.city,
      State: c.state,
      PIN: c.pin,
      Note: c.note,
    });
  } catch (err) {
    console.error("order save failed", id, err);
    return res.status(502).json({ ok: false, error: "save failed" });
  }
  return res.status(200).json({ ok: true, id, lines, totals: { sub: total, ship: 0, total } });
}
