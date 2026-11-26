import { resolve } from "node:path";

export const MAX_CATALOGUE_SIZE_BYTES = 10 * 1024 * 1024;
export const CATALOGUE_ID_PATTERN =
  /^(?=.{1,120}$)[a-z0-9]+(?:-[a-z0-9]+)*$/i;

export function createCatalogueSlug(name: string) {
  const slug = name
    .replace(/\.pdf$/i, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");

  return slug || "catalogue";
}

export function getCatalogueStorageDirectory() {
  return resolve(process.env.CATALOGUE_UPLOAD_DIR || ".data/catalogues");
}
