import { CONFIG, INSTAGRAM_URL } from "../config.js";
import { firstName } from "../lib/format.js";
import { isIndianMobile, sendForm, showErrors } from "../lib/forms.js";

export function pageContact() {
  const html = `<div class="wrap"><div class="page-head"><p class="label">Contact</p><h1>Say hello</h1>
      <p>Questions about an order, gifting or bulk journals? Write to us and we will get back to you within a day.</p>
      <p>Email <span class="select-all">${CONFIG.email}</span></p></div>
    <section class="section-pad"><div class="contact-wrap">
      <form id="contact-form" class="form-grid" novalidate>
        <div class="field"><label for="c-name">Your name</label><input id="c-name" name="c-name" type="text" autocomplete="name" required><span class="err" id="c-name-err"></span></div>
        <div class="field"><label for="c-phone">Mobile number</label><input id="c-phone" name="c-phone" type="tel" inputmode="numeric" autocomplete="tel" placeholder="10-digit number" required><span class="err" id="c-phone-err"></span></div>
        <div class="field full"><label for="c-msg">Message</label><textarea id="c-msg" name="c-msg" rows="5" placeholder="A question, an order, a gifting or bulk request…" required></textarea><span class="err" id="c-msg-err"></span></div>
        <p class="full muted small">We use your details only to reply to you. No spam, ever.</p>
        <div class="full"><button class="btn" type="submit" id="c-send">Submit</button><p class="err" id="c-send-err" role="alert"></p></div>
      </form>
      <div id="contact-done" class="contact-done" hidden><p class="label">Message sent</p><h3 id="contact-done-title">Thank you.</h3>
        <p class="muted" id="contact-done-text">We will reply within a day, by phone or email.</p>
        <div class="actions"><button type="button" class="btn btn--quiet" id="contact-again">Write another message</button></div></div>
      <ul class="contact-list mt-28">
        <li><span>Email</span><span class="select-all">${CONFIG.email}</span></li>
        <li><span>Instagram</span><span><a href="${INSTAGRAM_URL}" target="_blank" rel="noopener">@${CONFIG.instagram}</a></span></li>
      </ul>
    </div></section></div>`;

  return {
    html,
    mount() {
      const form = document.getElementById("contact-form");
      const done = document.getElementById("contact-done");
      const btn = document.getElementById("c-send");
      const err = document.getElementById("c-send-err");
      const reset = () => {
        btn.disabled = false;
        btn.textContent = "Submit";
      };
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const v = {
          name: form.elements["c-name"].value.trim(),
          phone: form.elements["c-phone"].value.trim(),
          msg: form.elements["c-msg"].value.trim(),
        };
        const ok = showErrors({
          "c-name": v.name.length < 2 ? "Please enter your name." : "",
          "c-phone": !isIndianMobile(v.phone) ? "Enter a 10-digit Indian mobile number." : "",
          "c-msg": v.msg.length < 3 ? "Please write a short message." : "",
        });
        if (!ok) return;
        btn.disabled = true;
        btn.textContent = "Sending…";
        err.textContent = "";
        try {
          const how = await sendForm("contact", { name: v.name, phone: v.phone, message: v.msg });
          document.getElementById("contact-done-title").textContent = `Thank you, ${firstName(v.name)}.`;
          if (how === "preview") {
            document.getElementById("contact-done-text").textContent =
              `Preview only: once the site's form key is set, this message is sent to ${CONFIG.email}.`;
          }
          form.hidden = true;
          done.hidden = false;
        } catch {
          err.textContent = `Your message could not be sent. Please try again, or email ${CONFIG.email}.`;
        }
        reset();
      });
      document.getElementById("contact-again").addEventListener("click", () => {
        form.reset();
        form.hidden = false;
        done.hidden = true;
      });
    },
  };
}
