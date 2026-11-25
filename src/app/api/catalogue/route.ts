import { randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { authorizeCatalogueAdmin } from "@/lib/catalogue-admin-auth";
import {
  CATALOGUE_ID_PATTERN,
  getCatalogueStorageDirectory,
  MAX_CATALOGUE_SIZE_BYTES,
} from "@/lib/catalogue-storage";

const MAX_MULTIPART_OVERHEAD_BYTES = 256 * 1024;

type CatalogueMetadata = {
  filename: string;
  uploadedAt: string;
};

function isCatalogueMetadata(value: unknown): value is CatalogueMetadata {
  return (
    typeof value === "object" &&
    value !== null &&
    "filename" in value &&
    typeof value.filename === "string" &&
    "uploadedAt" in value &&
    typeof value.uploadedAt === "string"
  );
}

export async function GET(request: Request) {
  const authError = authorizeCatalogueAdmin(request);
  if (authError) {
    return authError;
  }

  const storageDirectory = getCatalogueStorageDirectory();
  let filenames: string[];
  try {
    filenames = await readdir(storageDirectory);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return Response.json(
        { catalogues: [] },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
    throw error;
  }

  const ids = filenames
    .filter((filename) => filename.endsWith(".pdf"))
    .map((filename) => filename.slice(0, -".pdf".length))
    .filter((id) => CATALOGUE_ID_PATTERN.test(id));

  const catalogues = await Promise.all(
    ids.map(async (id) => {
      const pdfPath = join(storageDirectory, `${id}.pdf`);
      const fileStats = await stat(pdfPath);
      let filename = `Catalogue ${id.slice(0, 8)}.pdf`;
      let uploadedAt = fileStats.mtime.toISOString();

      try {
        const metadata: unknown = JSON.parse(
          await readFile(join(storageDirectory, `${id}.json`), "utf8"),
        );
        if (isCatalogueMetadata(metadata)) {
          filename = metadata.filename;
          uploadedAt = metadata.uploadedAt;
        }
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code !== "ENOENT"
        ) {
          throw error;
        }
      }

      return { id, filename, uploadedAt };
    }),
  );

  catalogues.sort((left, right) =>
    right.uploadedAt.localeCompare(left.uploadedAt),
  );

  return Response.json(
    { catalogues },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const contentLengthHeader = request.headers.get("content-length");
  if (!contentLengthHeader) {
    return Response.json(
      { error: "The upload request must include a content length." },
      { status: 411 },
    );
  }

  const contentLength = Number(contentLengthHeader);
  if (!Number.isSafeInteger(contentLength) || contentLength < 0) {
    return Response.json({ error: "Invalid upload size." }, { status: 400 });
  }
  if (contentLength > MAX_CATALOGUE_SIZE_BYTES + MAX_MULTIPART_OVERHEAD_BYTES) {
    return Response.json(
      { error: "PDF files must be 10 MB or smaller." },
      { status: 413 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { error: "Invalid PDF upload request." },
      { status: 400 },
    );
  }

  const file = formData.get("catalogue");
  if (!(file instanceof File) || file.size === 0) {
    return Response.json(
      { error: "Choose a PDF catalogue to upload." },
      { status: 400 },
    );
  }
  if (file.size > MAX_CATALOGUE_SIZE_BYTES) {
    return Response.json(
      { error: "PDF files must be 10 MB or smaller." },
      { status: 413 },
    );
  }

  const fileContents = Buffer.from(await file.arrayBuffer());
  const pdfHeader = fileContents.subarray(0, 1024).toString("latin1");
  if (!pdfHeader.includes("%PDF-")) {
    return Response.json(
      { error: "The selected file is not a valid PDF." },
      { status: 415 },
    );
  }

  const id = randomUUID();
  const storageDirectory = getCatalogueStorageDirectory();
  const filename =
    file.name
      .replace(/[\\/\u0000-\u001f\u007f]/g, "_")
      .slice(0, 255) || "catalogue.pdf";
  const uploadedAt = new Date().toISOString();
  await mkdir(storageDirectory, { recursive: true });
  await writeFile(join(storageDirectory, `${id}.pdf`), fileContents, {
    flag: "wx",
    mode: 0o600,
  });
  await writeFile(
    join(storageDirectory, `${id}.json`),
    JSON.stringify({ filename, uploadedAt }),
    { flag: "wx", mode: 0o600 },
  );

  return Response.json({ url: `/api/catalogue/${id}` });
}
