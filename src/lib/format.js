const ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Escape a value for safe use inside HTML text or attributes. */
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ENTITIES[c]);

export const rupee = (n) => "₹" + Number(n).toLocaleString("en-IN");

export const firstName = (name) => String(name).split(" ")[0];
