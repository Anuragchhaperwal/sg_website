import { readFile, unlink } from "node:fs/promises";
import { join } from "node:path";
import { authorizeCatalogueAdmin } from "@/lib/catalogue-admin-auth";
import {
  CATALOGUE_ID_PATTERN,
  getCatalogueStorageDirectory,
} from "@/lib/catalogue-storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!CATALOGUE_ID_PATTERN.test(id)) {
    return new Response("Not found", { status: 404 });
  }

  let pdf: Buffer;
  try {
    pdf = await readFile(join(getCatalogueStorageDirectory(), `${id}.pdf`));
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return new Response("Not found", { status: 404 });
    }
    throw error;
  }

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Disposition": 'inline; filename="catalogue.pdf"',
      "Content-Length": String(pdf.byteLength),
      "Content-Type": "application/pdf",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = authorizeCatalogueAdmin(request);
  if (authError) {
    return authError;
  }

  const { id } = await params;
  if (!CATALOGUE_ID_PATTERN.test(id)) {
    return new Response("Not found", { status: 404 });
  }

  const storageDirectory = getCatalogueStorageDirectory();
  try {
    await unlink(join(storageDirectory, `${id}.pdf`));
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return new Response("Not found", { status: 404 });
    }
    throw error;
  }

  try {
    await unlink(join(storageDirectory, `${id}.json`));
  } catch (error) {
    if (
      typeof error !== "object" ||
      error === null ||
      !("code" in error) ||
      error.code !== "ENOENT"
    ) {
      throw error;
    }
  }

  return Response.json({ deleted: true });
}
