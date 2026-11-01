// Runtime validation coverage for contact enquiry emails.
import { describe, expect, it } from "vitest";
import { buildContactMailto } from "../src/lib/contact-email";

describe("buildContactMailto", () => {
  it("creates an encoded email with the submitted project details", () => {
    const mailto = buildContactMailto({
      name: "Riya Shah",
      email: "riya@example.com",
      phone: "+91 98765 43210",
      interest: "Residential project",
      message: "We need marble for a new home.",
    });
    const url = new URL(mailto);

    expect(url.protocol).toBe("mailto:");
    expect(url.pathname).toBe("info@samdanigroup.com");
    expect(url.searchParams.get("subject")).toBe(
      "Project enquiry: Residential project",
    );
    expect(url.searchParams.get("body")).toBe(
      [
        "Name: Riya Shah",
        "Email: riya@example.com",
        "Phone: +91 98765 43210",
        "I'm interested in: Residential project",
        "",
        "We need marble for a new home.",
      ].join("\n"),
    );
  });

  it("omits an optional phone number from the email", () => {
    const mailto = buildContactMailto({
      name: "Riya Shah",
      email: "riya@example.com",
      phone: "",
      interest: "",
      message: "Please share your stone options.",
    });
    const url = new URL(mailto);

    expect(url.searchParams.get("subject")).toBe("Project enquiry");
    expect(url.searchParams.get("body")).toBe(
      [
        "Name: Riya Shah",
        "Email: riya@example.com",
        "",
        "Please share your stone options.",
      ].join("\n"),
    );
  });
});
