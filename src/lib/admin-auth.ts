import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

function getAdminSecret(): Buffer {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "ADMIN_SECRET must be configured with at least 16 characters"
    );
  }
  return Buffer.from(secret, "utf8");
}

function hmacSignature(data: string): string {
  const secret = getAdminSecret();
  const hmac = createHmac("sha256", secret);
  hmac.update(data);
  return hmac.digest("hex");
}

export function verifyAdminPassword(candidate: string): boolean {
  try {
    const secret = getAdminSecret();
    const candidateBuf = Buffer.from(candidate, "utf8");
    // Pad to same length for timing-safe comparison
    const paddedCandidate = Buffer.alloc(secret.length);
    candidateBuf.copy(paddedCandidate, 0, 0, Math.min(candidateBuf.length, secret.length));
    return timingSafeEqual(paddedCandidate, secret);
  } catch {
    return false;
  }
}

export function createAdminSessionToken(): string {
  const payload = JSON.stringify({
    role: "admin",
    createdAt: Date.now(),
  });
  const encoded = Buffer.from(payload).toString("base64url");
  const sig = hmacSignature(encoded);
  return `${encoded}.${sig}`;
}

export function verifyAdminSessionToken(
  token: string | undefined | null
): boolean {
  if (!token) return false;
  try {
    const dotIndex = token.lastIndexOf(".");
    if (dotIndex < 0) return false;
    const encoded = token.slice(0, dotIndex);
    const sig = token.slice(dotIndex + 1);
    const expectedSig = hmacSignature(encoded);
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
      return false;
    }
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    );
    // Session expires after 8 hours
    const maxAge = 8 * 60 * 60 * 1000;
    if (Date.now() - payload.createdAt > maxAge) return false;
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function requireAdmin(): Promise<{
  type: "session" | "user";
  userId?: string;
} | null> {
  // 1. Check signed admin session cookie
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("embir_admin_session")?.value;
  if (sessionToken && verifyAdminSessionToken(sessionToken)) {
    return { type: "session" };
  }

  // 2. Check JWT with ADMIN role
  const userToken = cookieStore.get("token")?.value;
  if (userToken) {
    const payload = verifyToken(userToken);
    if (payload) {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, role: true },
      });
      if (user && (user.role === "ADMIN")) {
        return { type: "user", userId: user.id };
      }
    }
  }

  return null;
}
