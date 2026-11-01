export type Collection = {
  slug: string;
  number: string;
  name: string;
  description: string;
  href: string;
  headline: string;
  intro: string;
  story: string;
  tone: string;
  palette: { name: string; color: string }[];
  finishes: string[];
  applications: string[];
};

const collectionData: Omit<Collection, "href">[] = [
  {
    slug: "world-of-whites",
    number: "01",
    name: "World of Whites",
    description: "Light tones with a timeless presence.",
    headline: "Quiet light, *timeless calm.*",
    intro:
      "Bright, serene surfaces that open up a room and let natural light do the rest.",
    story:
      "From soft milky grounds to crisp whites traced with delicate veining, this collection brings an effortless sense of space and clarity. Each slab is selected for consistency of tone while keeping the subtle variations that make natural stone unique.",
    tone: "#ece7dd",
    palette: [
      { name: "Snow white", color: "#f4f1ea" },
      { name: "Ivory", color: "#ece4d3" },
      { name: "Soft pearl", color: "#dedbd3" },
    ],
    finishes: ["Polished", "Honed", "Leathered"],
    applications: ["Flooring", "Wall cladding", "Bathrooms", "Feature walls"],
  },
  {
    slug: "grey-grandeur",
    number: "02",
    name: "Grey Grandeur",
    description: "Cool tones with depth and character.",
    headline: "Cool depth, *quiet strength.*",
    intro:
      "Considered greys that bring balance, sophistication, and a calm modern edge.",
    story:
      "Ranging from pale dove tones to deep charcoal, these stones carry a confident, architectural presence. Their versatile character pairs naturally with timber, metal, and glass across residential and commercial spaces.",
    tone: "#8d8c88",
    palette: [
      { name: "Dove grey", color: "#c3c1bb" },
      { name: "Storm", color: "#8d8c88" },
      { name: "Charcoal", color: "#4a4946" },
    ],
    finishes: ["Polished", "Honed", "Flamed"],
    applications: ["Flooring", "Countertops", "Facades", "Staircases"],
  },
  {
    slug: "the-luxe-edit",
    number: "03",
    name: "The Luxe Edit",
    description: "Statement surfaces for distinctive spaces.",
    headline: "Bold character, *made to be seen.*",
    intro:
      "A curated selection of rare, expressive stones for spaces that deserve a centerpiece.",
    story:
      "Dramatic veining, rich colour, and striking movement define this edit. Chosen for their individuality, these surfaces turn lobbies, kitchens, and feature walls into lasting impressions.",
    tone: "#3b3127",
    palette: [
      { name: "Nero", color: "#2a2622" },
      { name: "Antique gold", color: "#b08d57" },
      { name: "Emerald", color: "#3f5a4b" },
    ],
    finishes: ["Polished", "Book-matched", "Honed"],
    applications: ["Feature walls", "Kitchen islands", "Lobbies", "Vanities"],
  },
  {
    slug: "beyond-beige",
    number: "04",
    name: "Beyond Beige",
    description: "Warm neutrals in their natural element.",
    headline: "Warm neutrals, *naturally inviting.*",
    intro:
      "Sun-warmed creams and sandy tones that make every space feel grounded and welcoming.",
    story:
      "Inspired by earth and sunlight, these stones bring warmth without overpowering a room. Their gentle tones are easy to live with and work beautifully across classic and contemporary interiors.",
    tone: "#cdb79a",
    palette: [
      { name: "Cream", color: "#e6d8c1" },
      { name: "Sand", color: "#cdb79a" },
      { name: "Honey", color: "#b18f68" },
    ],
    finishes: ["Polished", "Honed", "Tumbled"],
    applications: ["Flooring", "Living spaces", "Outdoor paving", "Wall cladding"],
  },
  {
    slug: "art-of-textures",
    number: "05",
    name: "Art of Textures",
    description: "Natural patterns with a tactile touch.",
    headline: "Surfaces you can *feel.*",
    intro:
      "Expressive textures and natural patterns that add depth, shadow, and craft to any space.",
    story:
      "Brushed, split, and sculpted finishes reveal the raw beauty within each stone. This collection celebrates touch and texture, adding a handcrafted quality to walls, facades, and landscapes.",
    tone: "#7b6b58",
    palette: [
      { name: "Riven slate", color: "#5f5a52" },
      { name: "Rustic", color: "#8f7458" },
      { name: "Sandstone", color: "#bfa47f" },
    ],
    finishes: ["Brushed", "Split face", "Sandblasted"],
    applications: ["Facades", "Landscaping", "Feature walls", "Pool surrounds"],
  },
];

export const collections: Collection[] = collectionData.map((collection) => ({
  ...collection,
  href: `/collections/${collection.slug}`,
}));

export function getCollection(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}
