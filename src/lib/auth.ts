import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "feminy...2026";

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
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): {
  userId: string;
  email: string;
} | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch {
    return null;
  }
}

import { cookies, headers } from "next/headers";

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
  return { id: payload.userId, email: payload.email };
}
