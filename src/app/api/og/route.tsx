import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const GOLD = "#d4a574";
const EMBER = "#ff5e36";
const ROSE = "#ff1f5a";
const BG = "#0a0614";

/**
 * Dynamic OG Image generator for Embir.
 * Usage: /api/og?title=Free Dating App&subtitle=Switzerland&variant=market
 * Variants: default, market, city, product, referral
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Embir — Dating Without Swipe Fatigue";
  const subtitle = searchParams.get("subtitle") || "core connection features are free · Verified profiles · Every orientation";
  const variant = searchParams.get("variant") || "default";
  const locale = searchParams.get("locale") || "en";

  const isFR = locale === "fr";
  const badge = isFR ? "gratuit pour les connexions essentielles" : "core connection features are free";

  // Variant-specific accent colors
  const accents: Record<string, { primary: string; secondary: string; glow: string }> = {
    default: { primary: GOLD, secondary: EMBER, glow: ROSE },
    market: { primary: GOLD, secondary: EMBER, glow: ROSE },
    city: { primary: EMBER, secondary: GOLD, glow: ROSE },
    product: { primary: GOLD, secondary: ROSE, glow: EMBER },
    referral: { primary: ROSE, secondary: GOLD, glow: EMBER },
  };
  const accent = accents[variant] || accents.default;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: BG,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background gradient orbs */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "60%",
            height: "60%",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accent.primary}22, transparent 70%)`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30%",
            left: "-15%",
            width: "70%",
            height: "70%",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accent.glow}15, transparent 70%)`,
            display: "flex",
          }}
        />

        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${accent.primary}06 1px, transparent 1px), linear-gradient(90deg, ${accent.primary}06 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "70px 80px",
            height: "100%",
            position: "relative",
          }}
        >
          {/* Top: Brand + badge */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {/* Logo mark — stylized flame */}
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: `linear-gradient(135deg, ${accent.primary}, ${accent.secondary})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  fontWeight: 900,
                  color: BG,
                }}
              >
                E
              </div>
              <div style={{ display: "flex", fontSize: "32px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em" }}>
                Embir
              </div>
            </div>
            <div
              style={{
                display: "flex",
                padding: "8px 24px",
                borderRadius: "999px",
                background: `${accent.primary}20`,
                border: `1px solid ${accent.primary}40`,
                fontSize: "18px",
                fontWeight: 600,
                color: accent.primary,
              }}
            >
              {badge}
            </div>
          </div>

          {/* Middle: Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "900px" }}>
            <div
              style={{
                display: "flex",
                fontSize: "64px",
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              {title.length > 60 ? title.slice(0, 57) + "…" : title}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "28px",
                fontWeight: 400,
                color: "#ffffff99",
                lineHeight: 1.3,
                maxWidth: "800px",
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Bottom: Feature pills */}
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            {[
              isFR ? "Profils vérifiés" : "Verified profiles",
              isFR ? "Toutes orientations" : "Every orientation",
              isFR ? "Sans swipe fatigue" : "No swipe fatigue",
            ].map((pill) => (
              <div
                key={pill}
                style={{
                  display: "flex",
                  padding: "10px 20px",
                  borderRadius: "12px",
                  background: "#ffffff08",
                  border: "1px solid #ffffff15",
                  fontSize: "18px",
                  fontWeight: 500,
                  color: "#ffffffcc",
                }}
              >
                {pill}
              </div>
            ))}
          </div>
        </div>

        {/* Accent line at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: `linear-gradient(90deg, ${accent.primary}, ${accent.secondary}, ${accent.glow})`,
            display: "flex",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
