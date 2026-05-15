import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const lat = parseFloat(request.nextUrl.searchParams.get("lat") || "");
  const lon = parseFloat(request.nextUrl.searchParams.get("lon") || "");

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json({ error: "Paramètres lat et lon requis" }, { status: 400 });
  }

  // Reverse geocoding via Nominatim (OpenStreetMap, gratuit, usage raisonnable)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=fr`,
      {
        headers: { "User-Agent": "Femynia/1.0 (iamdalilrhasrhass@gmail.com)" },
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`Nominatim ${res.status}`);

    const data = await res.json();

    const city =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.municipality ||
      data.display_name?.split(",")[0] ||
      null;

    const postalCode = data.address?.postcode || null;
    const country = data.address?.country || null;

    return NextResponse.json({ city, postalCode, country, lat, lon });
  } catch {
    // Fallback: renvoyer juste les coordonnées
    return NextResponse.json({
      city: null,
      postalCode: null,
      country: null,
      lat,
      lon,
    });
  }
}
