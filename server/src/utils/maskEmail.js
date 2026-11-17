export function maskEmail(email) {
  const [local, ...domainParts] = String(email).trim().split("@");
  const domain = domainParts.join("@");
  if (!local || !domain || !domain.includes(".")) {
    throw new Error("Enter a valid email address.");
  }

  const visible = local.slice(0, 2);
  const stars = "*".repeat(Math.max(4, local.length - visible.length));
  return `${visible}${stars}@${domain}`;
}
