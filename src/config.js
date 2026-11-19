// Site settings. Secrets-free: the Web3Forms key is a public access key, set per environment in Vercel.
const env = import.meta.env || {};

export const CONFIG = {
  instagram: "plant_qi",
  email: "hello@plantqi.com",
  // "email" = Web3Forms emails each order to hello@plantqi.com; "sheet" = Google Apps Script web app
  backend: env.VITE_FORM_BACKEND || "email",
  web3formsKey: (env.VITE_WEB3FORMS_KEY || "").trim(),
  sheetUrl: (env.VITE_SHEET_URL || "").trim(),
  ships2027: "Ships in 3–5 working days",
  ships2026: "Ships in 3–5 working days",
};

export const INSTAGRAM_URL = "https://instagram.com/" + CONFIG.instagram;
