import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getResumeStorageDirectory } from "@/lib/resume-storage";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    return new Response("Not found", { status: 404 });
  }

  let pdf: Buffer;
  try {
    pdf = await readFile(join(getResumeStorageDirectory(), `${id}.pdf`));
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
      "Cache-Control": "no-store",
      "Content-Disposition": 'inline; filename="resume.pdf"',
      "Content-Length": String(pdf.byteLength),
      "Content-Type": "application/pdf",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
