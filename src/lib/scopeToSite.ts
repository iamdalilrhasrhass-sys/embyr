/**
 * Multi-site scope helper — filters queries by site visibility.
 * A user is visible on a site if:
 * 1. They originated from that site (origin_site = siteId), OR
 * 2. They opted in via user_site_visibility table
 */

export function scopeUsersToSite(siteId: number) {
  return {
    OR: [
      { originSite: siteId },
      { siteVisibility: { some: { siteId, isVisible: true } } },
    ],
  };
}

export async function enforceSiteAccess(
  userId: string,
  siteId: number,
  prisma: any
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      originSite: true,
      siteVisibility: { where: { siteId }, select: { isVisible: true } },
    },
  });
  if (!user) return false;
  if (user.originSite === siteId) return true;
  return user.siteVisibility.some((v: any) => v.isVisible);
}
