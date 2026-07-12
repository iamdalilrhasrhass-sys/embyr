// ── Closed allow-list for file uploads ──

export const ALLOWED_AUDIO_MIME: ReadonlySet<string> = new Set([
  "audio/webm",
  "audio/mp4",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
]);

export const ALLOWED_IMAGE_MIME: ReadonlySet<string> = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const AUDIO_MAX_SIZE = 10 * 1024 * 1024; // 10 MB
export const IMAGE_MAX_SIZE = 8 * 1024 * 1024; // 8 MB

export interface UploadPolicyResult {
  ok: true;
  extension: string;
}

export function validateAudioUpload(
  mimeType: string,
  fileSize: number
): UploadPolicyResult | { ok: false; error: string; status: number } {
  if (!ALLOWED_AUDIO_MIME.has(mimeType)) {
    return { ok: false, error: "Format audio non supporté", status: 400 };
  }
  if (fileSize > AUDIO_MAX_SIZE) {
    return { ok: false, error: "Audio trop volumineux (max 10 Mo)", status: 413 };
  }
  return { ok: true, extension: mimeExtension(mimeType) };
}

export function validateAudioSignature(buffer: Uint8Array, mimeType: string): boolean {
  if (buffer.length < 12) return false;
  const starts = (...bytes: number[]) => bytes.every((byte, index) => buffer[index] === byte);
  const ascii = (offset: number, value: string) =>
    [...value].every((character, index) => buffer[offset + index] === character.charCodeAt(0));
  if (mimeType === "audio/webm") return starts(0x1a, 0x45, 0xdf, 0xa3);
  if (mimeType === "audio/mp4") return ascii(4, "ftyp");
  if (mimeType === "audio/mpeg") return ascii(0, "ID3") || (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0);
  if (mimeType === "audio/wav") return ascii(0, "RIFF") && ascii(8, "WAVE");
  if (mimeType === "audio/ogg") return ascii(0, "OggS");
  return false;
}

export function validateImageUpload(
  mimeType: string,
  fileSize: number
): UploadPolicyResult | { ok: false; error: string; status: number } {
  if (!ALLOWED_IMAGE_MIME.has(mimeType)) {
    return { ok: false, error: "Format image non supporté", status: 400 };
  }
  if (fileSize > IMAGE_MAX_SIZE) {
    return { ok: false, error: "Image trop volumineuse (max 8 Mo)", status: 413 };
  }
  return { ok: true, extension: mimeExtension(mimeType) };
}

export function validateImageSignature(buffer: Uint8Array, mimeType: string): boolean {
  const starts = (...bytes: number[]) => bytes.every((byte, index) => buffer[index] === byte);
  const ascii = (offset: number, value: string) =>
    [...value].every((character, index) => buffer[offset + index] === character.charCodeAt(0));

  if (mimeType === "image/jpeg") {
    return buffer.length >= 3 && starts(0xff, 0xd8, 0xff);
  }
  if (mimeType === "image/png") {
    return buffer.length >= 8 && starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
  }
  if (mimeType === "image/webp") {
    return buffer.length >= 12 && ascii(0, "RIFF") && ascii(8, "WEBP");
  }
  return false;
}

function mimeExtension(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "audio/webm": "webm",
    "audio/mp4": "mp4",
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "audio/ogg": "ogg",
  };
  return map[mimeType] ?? "bin";
}
