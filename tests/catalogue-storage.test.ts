import { describe, expect, it } from "vitest";
import {
  CATALOGUE_ID_PATTERN,
  createCatalogueSlug,
} from "../src/lib/catalogue-storage";

describe("createCatalogueSlug", () => {
  it("uses a readable lowercase slug without the PDF extension", () => {
    expect(createCatalogueSlug("Marble Collection 2026.pdf")).toBe(
      "marble-collection-2026",
    );
  });

  it("normalizes accented characters and punctuation", () => {
    expect(createCatalogueSlug("Élite & Stone!")).toBe("elite-stone");
  });

  it("falls back to a safe slug when the name has no URL-safe characters", () => {
    expect(createCatalogueSlug("目录.pdf")).toBe("catalogue");
  });
});

describe("CATALOGUE_ID_PATTERN", () => {
  it("accepts readable slugs and existing UUID links", () => {
    expect(CATALOGUE_ID_PATTERN.test("marble-collection-2026")).toBe(true);
    expect(
      CATALOGUE_ID_PATTERN.test(
        "ebda99e6-7093-4f3d-bdad-59473d8a535e",
      ),
    ).toBe(true);
  });

  it("rejects path separators and file extensions", () => {
    expect(CATALOGUE_ID_PATTERN.test("../catalogue")).toBe(false);
    expect(CATALOGUE_ID_PATTERN.test("catalogue.pdf")).toBe(false);
  });
});
