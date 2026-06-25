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
