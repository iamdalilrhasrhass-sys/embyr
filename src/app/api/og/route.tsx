import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import {
  EMBIR_MARK_PATHS,
  EMBIR_MARK_STROKE_WIDTH,
} from "@/components/brand/EmbirMark";

export const runtime = "edge";

const ROSE = "#d88ba7";
const ROSE_DEEP = "#bf6f8d";
const BLUSH = "#f4c7d5";
const PLUM = "#4b1f3d";
const BG = "#09060c";
const BONE = "#f2ede4";

/**
 * Dynamic OG Image generator for Embir.
 * Usage: /api/og?title=Free Dating App&subtitle=Switzerland&variant=market
 * Variants: default, market, city, product, referral
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const variant = searchParams.get("variant") || "default";
  const locale = searchParams.get("locale") || "en";

  const isFR = locale === "fr";
  const isES = locale === "es";
  const title = searchParams.get("title") || (isFR
    ? "Embir — Des intentions partagées"
    : isES
      ? "Embir — Intenciones compartidas"
      : "Embir — Shared intentions");
  const subtitle = searchParams.get("subtitle") || (isFR
    ? "Des connexions réciproques · Profils vérifiés · Toutes orientations"
    : isES
      ? "Conexiones recíprocas · Perfiles verificados · Todas las orientaciones"
      : "Reciprocal connections · Verified profiles · Every orientation");
  const badge = isFR
    ? "connexions essentielles gratuites"
    : isES
      ? "conexiones esenciales gratis"
      : "core connections are free";

  // Variant-specific accents stay inside the canonical Brand OS palette.
  const accents: Record<string, { primary: string; secondary: string; glow: string }> = {
    default: { primary: ROSE, secondary: BLUSH, glow: PLUM },
    market: { primary: ROSE, secondary: BLUSH, glow: PLUM },
    city: { primary: ROSE_DEEP, secondary: ROSE, glow: PLUM },
    product: { primary: BLUSH, secondary: ROSE, glow: PLUM },
    referral: { primary: ROSE, secondary: BLUSH, glow: ROSE_DEEP },
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
              <svg
                width="62"
                height="62"
                viewBox="0 0 96 96"
                fill="none"
                aria-hidden="true"
              >
                {EMBIR_MARK_PATHS.map((path) => (
                  <path
                    key={path}
                    d={path}
                    stroke={BLUSH}
                    strokeWidth={EMBIR_MARK_STROKE_WIDTH}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
              </svg>
              <div style={{ display: "flex", fontSize: "38px", fontWeight: 700, color: BONE, letterSpacing: "-0.04em", fontFamily: "Georgia, serif" }}>
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
                color: BONE,
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
                color: "rgba(242, 237, 228, 0.64)",
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
              isFR ? "Profils vérifiés" : isES ? "Perfiles verificados" : "Verified profiles",
              isFR ? "Toutes orientations" : isES ? "Todas las orientaciones" : "Every orientation",
              isFR ? "Sans swipe fatigue" : isES ? "Sin fatiga de swipe" : "No swipe fatigue",
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
                  color: "rgba(242, 237, 228, 0.82)",
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
