import { resolve } from "node:path";

export const MAX_CATALOGUE_SIZE_BYTES = 10 * 1024 * 1024;

export function getCatalogueStorageDirectory() {
  return resolve(process.env.CATALOGUE_UPLOAD_DIR || ".data/catalogues");
}
