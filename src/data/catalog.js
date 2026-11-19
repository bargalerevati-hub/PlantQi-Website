export const IMG_PATH = "/images/";
export const img = (key) => IMG_PATH + key + ".webp";

export const COLOURS = [
  { id: "rose", name: "Rose pink", hex: "#D9A3BD" },
  { id: "yellow", name: "Sunshine yellow", hex: "#F3C35B" },
  { id: "blue", name: "Ocean blue", hex: "#4A5BA0", dark: true },
  { id: "grey", name: "Stone grey", hex: "#ABA7AC" },
];

export const colourById = (id) => COLOURS.find((c) => c.id === id) || COLOURS[0];

export const PRODUCTS = {
  j27: {
    id: "j27",
    route: "journal-2027",
    edition: "2027",
    name: "The Quiet Growth We Overlook 2027",
    short: "2027 journal",
    price: 999,
    status: "preorder",
    blurb:
      "Open pages and very few prompts, so you write your own mind. Plan each month, tick your habits on Sundays, look back and rate your month on the 29th.",
    specs: [
      ["Size", "A5 · 148 × 210 mm"],
      ["Pages", "224, cream paper"],
      ["Daily pages", "Two days a page, a mood face for each day"],
      ["Binding", "Hardcover, sewn, lies flat"],
      ["Cover", "Cream and sunshine-yellow hardcover"],
    ],
    images: ["cover27", "howto", "plan", "days", "sunday", "review"],
  },
  j26: {
    id: "j26",
    route: "journal-2026",
    edition: "2026",
    name: "The Quiet Growth We Overlook 2026",
    short: "2026 journal",
    price: null,
    status: "archive",
    colours: true,
    blurb:
      "Our first journal, launched in 2026. Daily pages to reflect, weekly and monthly reviews, and yearly habit trackers, in four colours.",
    specs: [
      ["Size", "A4"],
      ["Pages", "198"],
      ["Colours", "Rose pink, Sunshine yellow, Ocean blue, Stone grey"],
      ["Inside", "Daily pages, habit trackers, monthly reviews"],
    ],
    images: ["flat26", "stack26", "sDay26", "sHab26", "sWeek26"],
  },
  k27: {
    id: "k27",
    route: "journal-kids-2027",
    edition: "2027",
    name: "Daily Journal for Kids 2027",
    short: "Kids journal",
    price: null,
    status: "soon",
    blurb:
      "Playful prompts about animals, plants and kindness, with space to draw. For young readers to fill in alone or with a grown-up.",
  },
};

export const REVIEWS = [
  { name: "Aaradhna", text: "I love this journal! So damn cute. Love the intro page and the prompts." },
  { name: "Arjita", text: "It’s lovely, definitely planning to use it." },
  { name: "Mrinal", text: "The journal is too good… exactly what I was looking for 😍" },
];

export const SNAPS = [
  ["howto", "How to journal, in one page"],
  ["story", "The ladybug story"],
  ["map", "A map of your year"],
  ["plan", "Month plan: focus, habits, one thing to look forward to"],
  ["days", "Two days a page, a mood face each day"],
  ["sunday", "Sunday: tick your habits"],
  ["review", "Look back and rate your month"],
  ["glance", "Your year at a glance"],
];
