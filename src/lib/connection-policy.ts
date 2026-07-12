import type { ConnectionState, Prisma, PrismaClient } from "@prisma/client";

type DatabaseClient = PrismaClient | Prisma.TransactionClient;

export const MESSAGEABLE_STATES = [
  "REVEAL_COMPLETED",
  "CONVERSATION",
  "PLAN_PROPOSED",
  "PLAN_CONFIRMED",
  "MET",
  "CONTINUE",
  "FRIENDS",
] as const;

export function canonicalPair(first: string, second: string): [string, string] {
  return first < second ? [first, second] : [second, first];
}

export type ConversationAccess = {
  conversation: {
    id: string;
    user1Id: string;
    user2Id: string;
    matchId: string | null;
  };
  matchId: string;
  receiverId: string;
};

export type PolicyResult =
  | { ok: true; value: ConversationAccess }
  | { ok: false; status: 403 | 404 | 409; error: string };

export type ConnectionAccessResult =
  | {
      ok: true;
      value: {
        id: string;
        user1Id: string;
        user2Id: string;
        otherId: string;
        status: string;
        state: ConnectionState;
      };
    }
  | { ok: false; status: 403 | 404; error: string };

/** Central participant, account-state and bidirectional-block gate for a connection. */
export async function authorizeConnection(
  db: DatabaseClient,
  userId: string,
  matchId: string,
): Promise<ConnectionAccessResult> {
  const match = await db.match.findFirst({
    where: { id: matchId, OR: [{ user1Id: userId }, { user2Id: userId }] },
    select: { id: true, user1Id: true, user2Id: true, status: true, state: true },
  });
  if (!match) return { ok: false, status: 404, error: "Connexion introuvable" };

  const otherId = match.user1Id === userId ? match.user2Id : match.user1Id;
  const blocked = await db.block.findFirst({
    where: {
      OR: [
        { blockerId: userId, blockedId: otherId },
        { blockerId: otherId, blockedId: userId },
      ],
    },
    select: { id: true },
  });
  const other = await db.user.findFirst({
    where: { id: otherId, bannedAt: null, deletedAt: null },
    select: { id: true },
  });
  if (blocked) return { ok: false, status: 403, error: "Connexion indisponible" };
  if (!other) return { ok: false, status: 404, error: "Connexion introuvable" };

  return { ok: true, value: { ...match, otherId } };
}

export async function authorizeConversation(
  db: DatabaseClient,
  userId: string,
  conversationId: string,
): Promise<PolicyResult> {
  const conversation = await db.conversation.findFirst({
    where: { id: conversationId, OR: [{ user1Id: userId }, { user2Id: userId }] },
    select: { id: true, user1Id: true, user2Id: true, matchId: true },
  });
  if (!conversation) return { ok: false, status: 404, error: "Conversation introuvable" };
  const receiverId = conversation.user1Id === userId ? conversation.user2Id : conversation.user1Id;

  const [blocked, receiver, linkedMatch, legacyMatch] = await Promise.all([
    db.block.findFirst({
      where: { OR: [{ blockerId: userId, blockedId: receiverId }, { blockerId: receiverId, blockedId: userId }] },
      select: { id: true },
    }),
    db.user.findFirst({
      where: { id: receiverId, bannedAt: null, deletedAt: null },
      select: { id: true, profile: { select: { canReceiveMessages: true } } },
    }),
    conversation.matchId
      ? db.match.findUnique({ where: { id: conversation.matchId }, select: { id: true, status: true, state: true } })
      : Promise.resolve(null),
    conversation.matchId
      ? Promise.resolve(null)
      : db.match.findFirst({
          where: {
            user1Id: canonicalPair(conversation.user1Id, conversation.user2Id)[0],
            user2Id: canonicalPair(conversation.user1Id, conversation.user2Id)[1],
          },
          select: { id: true, status: true, state: true },
        }),
  ]);

  if (blocked) return { ok: false, status: 403, error: "Connexion bloquée" };
  if (!receiver || receiver.profile?.canReceiveMessages === false) {
    return { ok: false, status: 403, error: "Destinataire indisponible" };
  }
  const match = linkedMatch ?? legacyMatch;
  if (!match || match.status !== "mutual") {
    return { ok: false, status: 409, error: "Une connexion réciproque est requise" };
  }
  const isLegitimateLegacyConversation = !conversation.matchId && match.status === "mutual";
  if (!isLegitimateLegacyConversation && !MESSAGEABLE_STATES.includes(match.state as typeof MESSAGEABLE_STATES[number])) {
    return { ok: false, status: 409, error: "La connexion n’est pas ouverte à la conversation" };
  }
  return {
    ok: true,
    value: { conversation, matchId: match.id, receiverId },
  };
}

export async function findConversationForConnection(
  db: DatabaseClient,
  userId: string,
  targetUserId: string,
): Promise<PolicyResult> {
  if (userId === targetUserId) return { ok: false, status: 409, error: "Action invalide" };
  const [user1Id, user2Id] = canonicalPair(userId, targetUserId);
  const match = await db.match.findUnique({
    where: { user1Id_user2Id: { user1Id, user2Id } },
    select: { id: true, status: true, state: true, conversation: { select: { id: true } } },
  });
  if (!match || match.status !== "mutual" || !MESSAGEABLE_STATES.includes(match.state as typeof MESSAGEABLE_STATES[number])) {
    return { ok: false, status: 409, error: "Une connexion réciproque ouverte est requise" };
  }
  let conversation = match.conversation;
  if (!conversation) {
    const legacy = await db.conversation.findFirst({ where: { user1Id, user2Id }, select: { id: true } });
    if (!legacy) return { ok: false, status: 409, error: "Terminez d’abord la résonance" };
    conversation = legacy;
  }
  return authorizeConversation(db, userId, conversation.id);
}
