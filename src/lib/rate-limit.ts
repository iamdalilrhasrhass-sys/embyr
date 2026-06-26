import { prisma } from "@/lib/prisma";

/**
 * Anti-spam rate limiting for messages.
 *
 * Rules:
 * – New users (account < 24h old): max 5 new conversations per hour
 * – Verified users (profile.isVerified): max 20 messages per hour
 * – All users: block duplicate messages (same content to same conv w/in 10s)
 * – All users: block rapid sends (more than 1 message/2s average)
 * – All users: max 10 image sends per hour
 * – Unverified users: max 5 messages per hour
 */

/** Seconds a new user is considered "new" */
const NEW_USER_GRACE_PERIOD_SEC = 86400; // 24h

/** Max new conversations per hour for new users */
const MAX_NEW_CONVERSATIONS_PER_HOUR = 5;

/** Max messages per hour for verified users */
const MAX_MESSAGES_PER_HOUR_VERIFIED = 20;

/** Max messages per hour for unverified users */
const MAX_MESSAGES_PER_HOUR_UNVERIFIED = 5;

/** Cooldown for duplicate content (same text in same conversation) */
const DUPLICATE_COOLDOWN_SEC = 10;

/** Minimum interval between sends (rate: 1 msg / 2s) */
const MIN_INTERVAL_MS = 2000;

/** Max image/media sends per hour */
const MAX_IMAGE_SENDS_PER_HOUR = 10;

export interface RateLimitResult {
  allowed: boolean;
  reason?: string;
  retryAfter?: number;
}

/**
 * Check whether a user can send a message to a given receiver.
 * Does NOT check auth — caller must provide the authenticated userId.
 */
export async function checkMessageRateLimit(
  userId: string,
  receiverId: string,
  content: string,
  messageType: string = "text",
): Promise<RateLimitResult> {
  const [user, profile] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.profile.findUnique({ where: { userId } }),
  ]);

  if (!user) {
    return { allowed: false, reason: "Utilisateur introuvable" };
  }

  const isVerified = profile?.isVerified ?? false;
  const isNewUser =
    user.createdAt.getTime() > Date.now() - NEW_USER_GRACE_PERIOD_SEC * 1000;

  // ── 1. Duplicate content check ─────────────────────────────────────
  // Find the conversation first, then check for duplicate messages in it
  const conversation = await prisma.conversation.findFirst({
    where: {
      OR: [
        { user1Id: userId, user2Id: receiverId },
        { user1Id: receiverId, user2Id: userId },
      ],
    },
  });

  if (conversation && content) {
    const duplicateInConv = await prisma.message.findFirst({
      where: {
        senderId: userId,
        conversationId: conversation.id,
        content,
        createdAt: {
          gte: new Date(Date.now() - DUPLICATE_COOLDOWN_SEC * 1000),
        },
      },
      orderBy: { createdAt: "desc" },
    });
    if (duplicateInConv) {
      return {
        allowed: false,
        reason: "Message en double détecté. Attends quelques secondes.",
        retryAfter: DUPLICATE_COOLDOWN_SEC,
      };
    }
  }

  // ── 2. Rapid send check (more than 1 msg/2s) ─────────────────────
  const lastMessage = await prisma.message.findFirst({
    where: { senderId: userId },
    orderBy: { createdAt: "desc" },
  });
  if (lastMessage) {
    const elapsed = Date.now() - lastMessage.createdAt.getTime();
    if (elapsed < MIN_INTERVAL_MS) {
      return {
        allowed: false,
        reason: "Tu envoies trop vite. Ralentis.",
        retryAfter: Math.ceil((MIN_INTERVAL_MS - elapsed) / 1000),
      };
    }
  }

  // ── 3. Hourly message cap ─────────────────────────────────────────
  const oneHourAgo = new Date(Date.now() - 3600 * 1000);
  const messageCount = await prisma.message.count({
    where: {
      senderId: userId,
      createdAt: { gte: oneHourAgo },
    },
  });

  const hourlyLimit = isVerified
    ? MAX_MESSAGES_PER_HOUR_VERIFIED
    : MAX_MESSAGES_PER_HOUR_UNVERIFIED;

  if (messageCount >= hourlyLimit) {
    return {
      allowed: false,
      reason: isVerified
        ? "Limite de 20 messages/heure atteinte."
        : "Limite de 5 messages/heure atteinte pour les comptes non vérifiés.",
      retryAfter: 3600,
    };
  }

  // ── 4. New conversation limit for new users ──────────────────────
  if (isNewUser && !conversation) {
    // This would be a brand new conversation
    const recentConvsCount = await prisma.conversation.count({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
        createdAt: { gte: oneHourAgo },
      },
    });
    if (recentConvsCount >= MAX_NEW_CONVERSATIONS_PER_HOUR) {
      return {
        allowed: false,
        reason: `Maximum 5 nouvelles conversations/heure pour les nouveaux comptes.`,
        retryAfter: 3600,
      };
    }
  }

  // ── 5. Image/media send cap ──────────────────────────────────────
  if (messageType === "image" || messageType === "media") {
    const imageCount = await prisma.message.count({
      where: {
        senderId: userId,
        type: { in: ["image", "media"] },
        createdAt: { gte: oneHourAgo },
      },
    });
    if (imageCount >= MAX_IMAGE_SENDS_PER_HOUR) {
      return {
        allowed: false,
        reason: "Maximum 10 envois d'images/heure atteint.",
        retryAfter: 3600,
      };
    }
  }

  return { allowed: true };
}
