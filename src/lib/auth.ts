import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET must be configured with at least 32 characters"
    );
  }
  return secret;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: { userId: string; email: string }) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): {
  userId: string;
  email: string;
} | null {
  try {
    const secret = getJwtSecret();
    return jwt.verify(token, secret) as { userId: string; email: string };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Response(JSON.stringify({ error: "Non autorisé" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return user;
}

export async function getCurrentUser() {
  let token = (await cookies()).get("token")?.value;

  if (!token) {
    try {
      const headersList = await headers();
      const auth = headersList.get("authorization");
      if (auth?.startsWith("Bearer ")) token = auth.slice(7);
    } catch {}
  }

  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;

  // A signed token is only an identity hint. Account state is authoritative.
  return prisma.user.findFirst({
    where: {
      id: payload.userId,
      email: payload.email,
      bannedAt: null,
      deletedAt: null,
    },
    select: { id: true, email: true, role: true },
  });
}
