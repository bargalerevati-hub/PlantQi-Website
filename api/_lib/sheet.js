// Server-only helpers for the /api functions. Files in api/_lib are not deployed as endpoints.

const MAX_LEN = 2000;

/** Trim every field to a string of bounded length. */
export function clean(obj, keys) {
  const out = {};
  keys.forEach((k) => (out[k] = String(obj?.[k] ?? "").trim().slice(0, MAX_LEN)));
  return out;
}

export function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  try {
    return JSON.parse(req.body || "{}");
  } catch {
    return {};
  }
}

export const nowIST = () => new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: false });

/**
 * Append a row through the Google Apps Script web app attached to the orders sheet.
 * Throws if the script is not configured or did not confirm the save.
 */
export async function saveToSheet(type, record) {
  const url = process.env.SHEET_WEBHOOK_URL;
  const secret = process.env.SHEET_SECRET;
  if (!url || !secret) throw new Error("SHEET_WEBHOOK_URL and SHEET_SECRET are not set");

  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, type, record }),
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  });
  const text = await r.text();
  let j = {};
  try {
    j = JSON.parse(text);
  } catch {
    /* Apps Script returned an HTML error page */
  }
  if (!r.ok || !j.ok) throw new Error("Sheet did not save: " + (j.error || r.status + " " + text.slice(0, 200)));
}

export function methodNotAllowed(req, res) {
  if (req.method === "POST") return false;
  res.setHeader("Allow", "POST");
  res.status(405).json({ ok: false, error: "Method not allowed" });
  return true;
}
