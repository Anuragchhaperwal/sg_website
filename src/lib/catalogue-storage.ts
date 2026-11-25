import { resolve } from "node:path";

export const MAX_CATALOGUE_SIZE_BYTES = 10 * 1024 * 1024;
export const CATALOGUE_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getCatalogueStorageDirectory() {
  return resolve(process.env.CATALOGUE_UPLOAD_DIR || ".data/catalogues");
}
