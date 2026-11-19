import { PRODUCTS, img } from "../data/catalog.js";
import { GIFT_LINE } from "../data/content.js";
import { rupee } from "../lib/format.js";
import { RHYTHM, productCard, reviewsHTML, snapsHTML } from "../components/ui.js";

export function thenSection() {
  return `<section class="section" id="then"><div class="wrap">
    <div class="edition-head"><h2>Where it began</h2><span class="muted">Our first journal, 2026 · sold out</span></div>
    <div class="then"><img src="${img("flat26")}" width="700" height="932" loading="lazy" alt="The 2026 journal in four colours">
      <div class="stack gap-14"><p>Plant Qi started with a journal in 2026, in rose, sunshine yellow, ocean blue and stone grey. It sold out, and these are a few words from the people who wrote in it.</p></div></div>
    <div class="mt-28">${reviewsHTML()}</div></div></section>`;
}

export function pageHome() {
  const p = PRODUCTS.j27;
  return `
  <section class="q-hero"><div class="wrap"><div class="wrap sheet dots hero-sheet">
    <div class="stack gap-24"><p class="label">The 2027 journal</p><h1>Your year, in your own words.</h1>
      <p class="lead">Messy or neat, one word or a whole page. No matter how imperfect it is, it's blossoming.</p>
      <div class="actions"><a class="btn" href="/journal-2027">Order · ${rupee(p.price)}</a><a class="btn btn--quiet" href="/journal-2027">See inside</a></div>
      <p class="gift-hint">${GIFT_LINE}</p></div>
    <img src="${img("cover27")}" width="1180" height="1617" fetchpriority="high" alt="The 2027 journal: a cream and sunshine-yellow hardcover with a small red ladybug and a red ribbon bookmark.">
  </div></div></section>

  <section class="section"><div class="wrap">
    <div class="edition-head"><h2>Inside the journal</h2><span class="muted">A rhythm for the whole year</span></div>
    ${RHYTHM}<div class="mt-36">${snapsHTML()}</div>
  </div></section>

  <section class="section"><div class="wrap">
    <div class="edition-head"><h2>By December</h2><span class="muted">Your year, at a glance</span></div>
    <div class="year-glance">
      <figure><img src="${img("mood27")}" width="1100" height="1500" loading="lazy" alt="An example mood tracker filled in for a whole year: one dot a night joined into a line across twelve months."><figcaption>One dot a night. By December, your year has a heartbeat.</figcaption></figure>
      <figure><img src="${img("ex27")}" width="1100" height="1420" loading="lazy" alt="An example fitness tracker for a whole year, with a tick for every day of movement and monthly totals."><figcaption>A tick for every day you moved. Watch the streaks appear.</figcaption></figure>
    </div>
    <p class="muted small mt-14">Example pages, filled in.</p>
  </div></section>

  <section class="section"><div class="wrap">
    <div class="edition-head"><h2>The journal</h2><a class="link" href="/journal-2027">Details</a></div>
    <div class="products products--single">${productCard("j27")}</div>
  </div></section>

  <section class="section"><div class="wrap">
    <div class="edition-head"><h2>Made with care</h2><span class="muted">Small details, every day</span></div>
    <div class="care">
      <div><b>A5 size</b><span>Fits your bag and your desk.</span></div>
      <div><b>Hardcover</b><span>Sewn binding that opens flat, so it is easy to write in.</span></div>
      <div><b>Cream paper</b><span>Soft on the eyes, kind to gel pens.</span></div>
      <div><b>For anyone 10+</b><span>Students, first jobs, busy parents, quiet thinkers.</span></div>
    </div>
  </div></section>

  <section class="section"><div class="wrap"><div class="gift dots">
    <div class="stack gap-14"><p class="label">Gifting</p><h2>A gift that lasts all year</h2>
      <p>For a sibling, a friend starting college, your Secret Santa or a new-year hamper. Teams and HR ordering for employees can write to us for bulk orders.</p>
      <ul class="for-chips" aria-label="Good for"><li>Students</li><li>Teams and HR</li><li>Secret Santa</li><li>New year</li><li>Anyone 10+</li></ul></div>
    <div><a class="btn btn--quiet" href="/contact">Bulk and gifting</a></div>
  </div></div></section>

  ${thenSection()}

  <section class="section"><div class="wrap idea">
    <div class="stack"><p class="label">Why a ladybug</p><svg viewBox="0 0 100 100" width="88" height="88" role="img" aria-label="A small red ladybug"><use href="#ladybug"/></svg></div>
    <div class="stack gap-20"><p class="story">In 1888, California's orange groves were dying and no spray could save them. A few hundred <em>ladybugs</em>, each smaller than a grain of rice, were set on a single tree. Within a year the groves were saved. Small things, done quietly and often, change everything. That is what this journal is for.</p><a class="link" href="/story">Our story</a></div>
  </div></section>`;
}
