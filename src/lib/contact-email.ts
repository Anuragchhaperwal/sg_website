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

  return `mailto:info@samdanigroup.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
