import { timingSafeEqual } from "node:crypto";

export function authorizeCatalogueAdmin(request: Request): Response | null {
  const expectedPassword = process.env.CATALOGUE_ADMIN_PASSWORD;
  if (!expectedPassword) {
    return Response.json(
      { error: "Catalogue admin access is not configured." },
      { status: 503 },
    );
  }

  const authorization = request.headers.get("authorization");
  const password =
    authorization?.startsWith("Bearer ") === true
      ? authorization.slice("Bearer ".length)
      : "";
  const expectedBytes = Buffer.from(expectedPassword);
  const passwordBytes = Buffer.from(password);

  if (
    expectedBytes.length !== passwordBytes.length ||
    !timingSafeEqual(expectedBytes, passwordBytes)
  ) {
    return Response.json(
      { error: "The admin password is incorrect." },
      { status: 401 },
    );
  }

  return null;
}
