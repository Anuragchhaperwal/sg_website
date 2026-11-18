export type ContactInquiry = {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
};

export function buildContactMailto({
  name,
  email,
  phone,
  interest,
  message,
}: ContactInquiry) {
  const details = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : "",
    interest ? `I'm interested in: ${interest}` : "",
  ]
    .filter(Boolean);
  const body = [...details, "", message].join("\n");
  const subject = interest ? `Project enquiry: ${interest}` : "Project enquiry";

  return `mailto:Info@samdanimarblegroup.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function buildResumeMailto({
  name,
  email,
  phone,
  resumeFileName,
}: {
  name: string;
  email: string;
  phone: string;
  resumeFileName: string;
}) {
  const details = [
    name ? `Name: ${name}` : "",
    email ? `Email: ${email}` : "",
    phone ? `Phone: ${phone}` : "",
    resumeFileName
      ? `Resume file: ${resumeFileName} (please attach it before sending)`
      : "",
  ].filter(Boolean);
  const body = details.join("\n");

  return `mailto:Info@samdanimarblegroup.com?subject=${encodeURIComponent("Resume submission")}&body=${encodeURIComponent(body)}`;
}
