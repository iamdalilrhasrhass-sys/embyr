import path from "node:path";

const PRIVATE_VERIFICATION_PREFIX = "private-verification:";

export function privateVerificationDirectory(): string {
  return process.env.PRIVATE_UPLOAD_DIR
    ? path.resolve(process.env.PRIVATE_UPLOAD_DIR, "verifications")
    : path.join(process.cwd(), "storage", "private", "verifications");
}
export function privateVerificationReference(filename: string): string {
  return `${PRIVATE_VERIFICATION_PREFIX}${path.basename(filename)}`;
}

export function privateVerificationFilename(reference: string): string | null {
  if (!reference.startsWith(PRIVATE_VERIFICATION_PREFIX)) return null;
  const filename = path.basename(reference.slice(PRIVATE_VERIFICATION_PREFIX.length));
  return filename && filename === reference.slice(PRIVATE_VERIFICATION_PREFIX.length)
    ? filename
    : null;
}
