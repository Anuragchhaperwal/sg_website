// Runtime validation coverage for contact enquiry emails.
import { describe, expect, it } from "vitest";
import {
  buildContactMailto,
  buildResumeMailto,
} from "../src/lib/contact-email";

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
    expect(url.pathname).toBe("Info@samdanimarblegroup.com");
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

  it("includes the shareable resume link and optional contact details", () => {
    const mailto = buildResumeMailto({
      name: "Riya Shah",
      email: "",
      phone: "+91 98765 43210",
      resumeUrl: "https://example.com/api/resumes/ebda99e6-7093-4f3d-bdad-59473d8a535e",
    });
    const url = new URL(mailto);

    expect(url.searchParams.get("subject")).toBe("Resume submission");
    expect(url.searchParams.get("body")).toBe(
      [
        "Name: Riya Shah",
        "Phone: +91 98765 43210",
        "Resume PDF: https://example.com/api/resumes/ebda99e6-7093-4f3d-bdad-59473d8a535e",
      ].join("\n"),
    );
  });

  it("allows a resume email with all fields left blank", () => {
    const mailto = buildResumeMailto({
      name: "",
      email: "",
      phone: "",
      resumeUrl: "",
    });
    const url = new URL(mailto);

    expect(url.searchParams.get("subject")).toBe("Resume submission");
    expect(url.searchParams.get("body")).toBe("");
  });
});
