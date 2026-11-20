// Field checks shared by the browser (instant feedback) and the API (the final word).
import { STATES } from "../data/content.js";

export const isIndianMobile = (v) => /^(\+?91)?[6-9]\d{9}$/.test(String(v).replace(/[\s-]/g, ""));
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v));
export const isPin = (v) => /^[1-9]\d{5}$/.test(String(v));

/** Returns { field: message } for every invalid delivery field ("" when valid). */
export function checkCustomer(v) {
  return {
    name: v.name.length < 2 ? "Please enter your full name." : "",
    phone: !isIndianMobile(v.phone) ? "Enter a 10-digit Indian mobile number." : "",
    email: !isEmail(v.email) ? "Enter an email address like name@example.com." : "",
    address1: v.address1.length < 2 ? "Please enter your flat or house number." : "",
    address2: v.address2.length < 3 ? "Please enter your street and area." : "",
    city: !v.city ? "Please enter your city." : "",
    state: !STATES.includes(v.state) ? "Please choose your state." : "",
    pin: !isPin(v.pin) ? "Enter a 6-digit PIN code." : "",
  };
}

export function checkMessage(v) {
  return {
    "c-name": v.name.length < 2 ? "Please enter your name." : "",
    "c-phone": !isIndianMobile(v.phone) ? "Enter a 10-digit Indian mobile number." : "",
    "c-msg": v.message.length < 3 ? "Please write a short message." : "",
  };
}
