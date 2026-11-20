const isLocal = () => /^(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)$/.test(location.hostname);

/**
 * POST JSON to one of the site's /api functions. Resolves the JSON reply.
 * Rejects with err.errors set when the server rejects fields, or a plain error when saving failed.
 * Under `vite dev` there are no API functions, so local runs resolve { preview: true } instead.
 */
export async function postForm(path, data) {
  let r;
  try {
    r = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });
  } catch (err) {
    if (isLocal()) return { ok: true, preview: true };
    throw err;
  }
  const j = await r.json().catch(() => null);
  if (!j) {
    if (isLocal()) return { ok: true, preview: true };
    throw new Error("send failed");
  }
  if (!r.ok || !j.ok) {
    const err = new Error(j.error || "send failed");
    err.errors = j.errors;
    throw err;
  }
  return j;
}

/**
 * Show field errors next to inputs (element ids match keys; error text goes in `${id}-err`).
 * Focuses the first invalid field and returns true when everything is valid.
 */
export function showErrors(errs) {
  let first = null;
  Object.keys(errs).forEach((id) => {
    const el = document.getElementById(id);
    const msg = document.getElementById(id + "-err");
    if (!el || !msg) return;
    msg.textContent = errs[id] || "";
    if (errs[id]) {
      el.setAttribute("aria-invalid", "true");
      first = first || el;
    } else el.removeAttribute("aria-invalid");
  });
  if (first) first.focus();
  return !first;
}

/** Hidden field that only bots fill in. */
export const HONEYPOT =
  '<div class="sr-only" aria-hidden="true"><label for="company">Company</label><input id="company" name="company" tabindex="-1" autocomplete="off"></div>';
