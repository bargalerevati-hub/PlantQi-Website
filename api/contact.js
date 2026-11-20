// POST /api/contact: saves a contact-form message to the "Messages" tab of the orders sheet.
import { checkMessage } from "../src/lib/validate.js";
import { clean, methodNotAllowed, nowIST, readBody, saveToSheet } from "./_lib/sheet.js";

export default async function handler(req, res) {
  if (methodNotAllowed(req, res)) return;
  const body = readBody(req);
  if (body.company) return res.status(200).json({ ok: true });

  const v = clean(body, ["name", "phone", "message"]);
  const errors = Object.fromEntries(Object.entries(checkMessage(v)).filter(([, msg]) => msg));
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, error: "invalid", errors });

  try {
    await saveToSheet("message", { Date: nowIST(), Name: v.name, Phone: v.phone, Message: v.message });
  } catch (err) {
    console.error("message save failed", err);
    return res.status(502).json({ ok: false, error: "save failed" });
  }
  return res.status(200).json({ ok: true });
}
