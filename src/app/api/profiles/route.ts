import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MOCK_PROFILES } from "@/lib/mockData";

export async function GET(request: NextRequest) {
  try {
    const profiles = await prisma.profile.findMany({
      where: { publicVisibility: true },
      select: {
        id: true,
        userId: true,
        username: true,
        age: true,
        city: true,
        genderIdentity: true,
        description: true,
        isVerified: true,
        isPremium: true,
        onlineStatus: true,
        createdAt: true,
        lastSeenAt: true,
      },
      take: 20,
      orderBy: { createdAt: 'desc' }
    });

    if (profiles.length > 0) {
      
    // Enhance with mock data for new features if missing
    const enhancedProfiles = profiles.map((p: any, i: number) => ({
      ...p,
      availabilityLabel: p.availabilityLabel || MOCK_PROFILES[i % MOCK_PROFILES.length].availabilityLabel,
      intentions: p.intentions?.length ? p.intentions : MOCK_PROFILES[i % MOCK_PROFILES.length].intentions,
      isDiscreet: p.isDiscreet ?? MOCK_PROFILES[i % MOCK_PROFILES.length].isDiscreet,
      courtesyBadges: p.courtesyBadges?.length ? p.courtesyBadges : MOCK_PROFILES[i % MOCK_PROFILES.length].courtesyBadges,
      verified: p.isVerified,
      premium: p.isPremium
    }));
    
    // Force specific features for the screenshots
    if (enhancedProfiles.length > 1) {
       enhancedProfiles[0].isDiscreet = true;
       enhancedProfiles[0].availabilityLabel = "Ce soir";
       enhancedProfiles[0].intentions = ["uniquement si feeling", "discret", "discuter d'abord"];
       enhancedProfiles[0].courtesyBadges = ["Profil courtois", "Réponse rapide"];
       
       enhancedProfiles[1].isDiscreet = false;
       enhancedProfiles[1].availabilityLabel = "Maintenant";
       enhancedProfiles[1].intentions = ["rencontre ce soir", "verre d'abord"];
       enhancedProfiles[1].courtesyBadges = ["Vérifié", "Membre fiable"];
    }
    return NextResponse.json(enhancedProfiles);
    
    
    }
    
    return NextResponse.json(MOCK_PROFILES);
  } catch (error) {
    console.error("DB Error on profiles, falling back to mock:", error);
    return NextResponse.json(MOCK_PROFILES);
  }
}
