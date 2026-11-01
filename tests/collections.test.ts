import { describe, expect, it } from "vitest";
import { collections, getCollection } from "../src/lib/collections";

describe("collections", () => {
  it("links every collection to an internal page", () => {
    for (const collection of collections) {
      expect(collection.href).toBe(`/collections/${collection.slug}`);
    }
  });

  it("uses unique slugs", () => {
    const slugs = collections.map((collection) => collection.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("finds collections by slug", () => {
    expect(getCollection("grey-grandeur")?.name).toBe("Grey Grandeur");
    expect(getCollection("missing")).toBeUndefined();
  });
});
