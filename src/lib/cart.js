import { PRODUCTS, colourById } from "../data/catalog.js";
import { store } from "./storage.js";

const KEY = "pq-bag";
const MAX_QTY = 20;
const listeners = new Set();

let lines = store.get(KEY, []).filter((l) => PRODUCTS[l.id] && PRODUCTS[l.id].price);

function save() {
  store.set(KEY, lines);
  listeners.forEach((fn) => fn());
}

const clamp = (n) => Math.max(1, Math.min(MAX_QTY, n));

export const cart = {
  lines: () => lines,
  isEmpty: () => lines.length === 0,
  count: () => lines.reduce((a, l) => a + l.qty, 0),
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  add(id, colour, qty) {
    const key = id + (colour ? ":" + colour : "");
    const line = lines.find((l) => l.key === key);
    if (line) line.qty = Math.min(MAX_QTY, line.qty + qty);
    else lines.push({ key, id, colour: colour || null, qty });
    save();
  },
  changeQty(index, delta) {
    const line = lines[index];
    if (!line) return;
    line.qty = clamp(line.qty + delta);
    save();
  },
  remove(index) {
    lines.splice(index, 1);
    save();
  },
  clear() {
    lines = [];
    save();
  },
  totals() {
    const sub = lines.reduce((a, l) => a + PRODUCTS[l.id].price * l.qty, 0);
    const ship = 0; // prices include delivery across India
    return { sub, ship, total: sub + ship };
  },
};

export const clampQty = clamp;
export const lineName = (l) => PRODUCTS[l.id].short + (l.colour ? ", " + colourById(l.colour).name : "");
export const lineAmount = (l) => PRODUCTS[l.id].price * l.qty;
