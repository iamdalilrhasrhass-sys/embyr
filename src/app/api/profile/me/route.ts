import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  // Support both cookie-based and Bearer token auth
  const cookieStore = await cookies();
  let token = cookieStore.get("token")?.value;
  
  // Fallback to Authorization header
  if (!token) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }
  }
  
  if (!token) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

  const profile = await prisma.profile.findUnique({
    where: { userId: decoded.userId },
  });
  
  if (!profile) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
  return NextResponse.json(profile);
}

export async function PUT(request: NextRequest) {
  const cookieStore = await cookies();
  let token = cookieStore.get("token")?.value;
  
  if (!token) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }
  }
  
  if (!token) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

  try {
    const data = await request.json();
    // Allow updating these fields
    const updated = await prisma.profile.update({
      where: { userId: decoded.userId },
      data: {
        username: data.username,
        age: data.age ? parseInt(data.age) : undefined,
        city: data.city,
        genderIdentity: data.genderIdentity, // Enum in DB
        description: data.description,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}
