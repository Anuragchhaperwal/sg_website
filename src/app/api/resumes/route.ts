import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  getResumeStorageDirectory,
  MAX_RESUME_SIZE_BYTES,
} from "@/lib/resume-storage";

const MAX_MULTIPART_OVERHEAD_BYTES = 256 * 1024;

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
  if (contentLength > MAX_RESUME_SIZE_BYTES + MAX_MULTIPART_OVERHEAD_BYTES) {
    return Response.json(
      { error: "PDF files must be 10 MB or smaller." },
      { status: 413 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid PDF upload request." }, { status: 400 });
  }

  const file = formData.get("resume");
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "Choose a PDF file to upload." }, { status: 400 });
  }
  if (file.size > MAX_RESUME_SIZE_BYTES) {
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
  const storageDirectory = getResumeStorageDirectory();
  await mkdir(storageDirectory, { recursive: true });
  await writeFile(join(storageDirectory, `${id}.pdf`), fileContents, {
    flag: "wx",
    mode: 0o600,
  });

  return Response.json({ url: `/api/resumes/${id}` });
}
