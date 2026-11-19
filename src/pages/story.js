import { nextUp } from "../components/ui.js";

export function pageStory() {
  return `<div class="wrap">
    <section class="q-hero story-hero"><div class="wrap">
      <p class="label">Our story</p><h1>We started with one question: how little do we <em>really</em> need?</h1>
    </div></section>
    <section class="section-pad"><div class="idea"><p class="label">The answer</p><div class="stack gap-28">
      <p class="answer">Less than we think. Fresh air, clean water, good food and the people we love. <em>Nature gives us most of it, quietly, every day.</em> We just stopped noticing.</p>
      <div class="prose">
        <p>Plant Qi began with my own small changes: eating simpler, wasting less and spending more time outdoors. Slowing down made me notice how much the living world gives us, and how rarely we stop to say thank you.</p>
        <p>Writing a few lines each evening helped me see those small changes add up. This journal is that habit, made for you.</p>
        <p><b>Qi</b> (say “chee”) is the life energy that flows through all living things. Plant Qi is a reminder to look after it, in nature and in ourselves.</p>
      </div>
    </div></div></section>
    <section class="section"><div class="north"><p class="label">What guides us</p><h2>Remember the source.</h2><p>The food on our plate, the paper we write on and the air we breathe all begin in nature. We hope this journal helps you notice that, value it, and live a little more gently, one honest line at a time.</p></div></section>
    ${nextUp("/shop", "Next", "The journal", "A rhythm for small, steady change, one honest line a day.")}
  </div>`;
}
