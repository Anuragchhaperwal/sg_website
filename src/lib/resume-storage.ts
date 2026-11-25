import { resolve } from "node:path";

export const MAX_RESUME_SIZE_BYTES = 10 * 1024 * 1024;

export function getResumeStorageDirectory() {
  return resolve(process.env.RESUME_UPLOAD_DIR || ".data/resumes");
}
