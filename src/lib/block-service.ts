import { prisma } from "@/lib/prisma";
import { canonicalPair } from "@/lib/connection-policy";

export async function blockUser(actorId: string, targetUserId: string) {
  if (actorId === targetUserId) throw new Error("INVALID_TARGET");
  const [user1Id, user2Id] = canonicalPair(actorId, targetUserId);
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${`embir-block:${actorId}:${targetUserId}`}))::text`;
    const target = await tx.user.findFirst({
      where: { id: targetUserId, deletedAt: null },
      select: { id: true },
    });
    if (!target) throw new Error("TARGET_NOT_FOUND");
    const existing = await tx.block.findUnique({
      where: { blockerId_blockedId: { blockerId: actorId, blockedId: targetUserId } },
    });
    if (existing) return { blocked: true, changed: false };
    await tx.block.create({ data: { blockerId: actorId, blockedId: targetUserId } });
    const match = await tx.match.findUnique({ where: { user1Id_user2Id: { user1Id, user2Id } } });
    if (match && match.state !== "BLOCKED") {
      await tx.match.update({ where: { id: match.id }, data: { state: "BLOCKED", lastTransitionAt: new Date() } });
      await tx.connectionEvent.create({
        data: { matchId: match.id, actorId, fromState: match.state, toState: "BLOCKED" },
      });
    }
    await tx.analyticsEvent.create({
      data: {
        eventId: crypto.randomUUID(),
        eventName: "user_blocked",
        eventVersion: 1,
        userId: actorId,
        occurredAt: new Date(),
        properties: { hadConnection: Boolean(match) },
      },
    });
    return { blocked: true, changed: true };
  });
}

export async function unblockUser(actorId: string, targetUserId: string) {
  const result = await prisma.block.deleteMany({ where: { blockerId: actorId, blockedId: targetUserId } });
  return { blocked: false, changed: result.count > 0 };
}
