import { getCollection } from "./collections";

export type ShowcaseSlide = {
  src: string;
  alt: string;
  space: string;
  title: string;
  collection: { name: string; href: string };
};

const slideData = [
  {
    src: "/images/slide-living.webp",
    alt: "An open living room with a grey herringbone stone fireplace wall",
    space: "Living spaces",
    title: "Calm, considered living.",
    collectionSlug: "grey-grandeur",
  },
  {
    src: "/images/slide-bath.webp",
    alt: "A bright white bathroom with a freestanding bath and stone vanity",
    space: "Bathrooms",
    title: "A quiet retreat in white.",
    collectionSlug: "world-of-whites",
  },
  {
    src: "/images/about-interior.webp",
    alt: "A bright kitchen with a marble-topped island",
    space: "Kitchens",
    title: "Gathered around marble.",
    collectionSlug: "the-luxe-edit",
  },
  {
    src: "/images/slide-entrance.webp",
    alt: "A modern home entrance with a natural slate stone driveway",
    space: "Outdoor",
    title: "Grounded at every step.",
    collectionSlug: "art-of-textures",
  },
  {
    src: "/images/slide-residence.webp",
    alt: "A contemporary residence glowing warmly at dusk",
    space: "Facades",
    title: "Warmth that welcomes you home.",
    collectionSlug: "beyond-beige",
  },
];

export const showcaseSlides: ShowcaseSlide[] = slideData.map(
  ({ collectionSlug, ...slide }) => {
    const collection = getCollection(collectionSlug);

    if (!collection) {
      throw new Error(`Unknown showcase collection: ${collectionSlug}`);
    }

    return {
      ...slide,
      collection: { name: collection.name, href: collection.href },
    };
  },
);
