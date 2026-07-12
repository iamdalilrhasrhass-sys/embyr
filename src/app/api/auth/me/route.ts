import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { withApiLogging } from "@/lib/api-logger";

async function handleGet() {
  try {
    const auth = await getCurrentUser();
    if (!auth) {
      return Response.json({ authenticated: false }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: { id: auth.id, bannedAt: null, deletedAt: null },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        phone: true,
        phoneVerified: true,
        role: true,
        profile: {
          select: {
            id: true,
            username: true,
            displayName: true,
            isPremium: true,
          },
        },
      },
    });

    if (!user) {
      return Response.json({ authenticated: false }, { status: 401 });
    }

    return Response.json(
      { authenticated: true, user },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch {
    return Response.json({ authenticated: false }, { status: 401 });
  }
}

export const GET = withApiLogging(handleGet);
