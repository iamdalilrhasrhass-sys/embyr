import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const geometry = JSON.parse(
  readFileSync("src/components/brand/embir-mark.json", "utf8"),
);

if (!Array.isArray(geometry.paths) || geometry.paths.length !== 2) {
  throw new Error("Embir mark geometry must contain exactly two paths");
}

const paths = geometry.paths;
const strokeWidth = geometry.strokeWidth;
const viewBox = geometry.viewBox;

mkdirSync("public/brand", { recursive: true });
mkdirSync("src/app", { recursive: true });

function pathMarkup(stroke) {
  return paths
    .map(
      (path) =>
        `<path d="${path}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`,
    )
    .join("\n  ");
}

function markSvg(stroke) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="96" height="96" fill="none">
  ${pathMarkup(stroke)}
</svg>\n`;
}

function lockupSvg(mark, word) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 120" width="520" height="120">
  <g transform="translate(10 12)" fill="none">
    ${pathMarkup(mark)}
  </g>
  <text x="126" y="82" fill="${word}" font-family="Georgia,serif" font-size="68" letter-spacing="-3">Embir</text>
</svg>\n`;
}

function appIconSvg({ maskable = false, light = false } = {}) {
  const scale = maskable ? 3.75 : 4.2;
  const offset = maskable ? 76 : 54.4;
  const radius = maskable ? "" : ' rx="112"';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512"${radius} fill="${light ? "#f4c7d5" : "#100a12"}"/>
  <g transform="translate(${offset} ${offset}) scale(${scale})" fill="none">
    ${pathMarkup(light ? "#2a1328" : "#f4c7d5")}
  </g>
</svg>\n`;
}

function ogSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <radialGradient id="rose" cx="0" cy="0" r="1" gradientTransform="translate(202 62) rotate(39) scale(650 460)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#4b1f3d" stop-opacity=".72"/>
      <stop offset="1" stop-color="#09060c" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#09060c"/>
  <rect width="1200" height="630" fill="url(#rose)"/>
  <g transform="translate(92 148) scale(3.35)" fill="none">
    ${pathMarkup("#f4c7d5")}
  </g>
  <text x="450" y="290" fill="#f2ede4" font-family="Georgia,serif" font-size="128" letter-spacing="-7">Embir</text>
  <text x="456" y="360" fill="#e7a8bc" font-family="Arial,sans-serif" font-size="30">Shared intentions. Reciprocal connections.</text>
  <path d="M456 404H1056" stroke="#f2ede4" stroke-opacity=".14"/>
  <text x="456" y="452" fill="#f2ede4" fill-opacity=".64" font-family="Arial,sans-serif" font-size="24">A safer, inclusive way to meet — in both directions.</text>
</svg>\n`;
}

const svgAssets = new Map([
  ["public/brand/embir-mark.svg", markSvg("#f4c7d5")],
  ["public/brand/embir-mark-dark.svg", markSvg("#f4c7d5")],
  ["public/brand/embir-mark-light.svg", markSvg("#2a1328")],
  ["public/brand/embir-mark-mono.svg", markSvg("#000")],
  ["public/brand/embir-mark-mono-white.svg", markSvg("#fff")],
  ["public/brand/embir-lockup-dark.svg", lockupSvg("#f4c7d5", "#f2ede4")],
  ["public/brand/embir-lockup-light.svg", lockupSvg("#2a1328", "#2a1328")],
  ["public/brand/embir-lockup-mono.svg", lockupSvg("#000", "#000")],
  ["public/brand/embir-lockup-mono-white.svg", lockupSvg("#fff", "#fff")],
  ["public/brand/embir-app-icon.svg", appIconSvg()],
  ["public/brand/embir-app-icon-light.svg", appIconSvg({ light: true })],
  ["public/brand/embir-app-icon-maskable.svg", appIconSvg({ maskable: true })],
  ["public/brand/embir-og.svg", ogSvg()],
  ["public/favicon.svg", appIconSvg()],
  ["src/app/icon.svg", appIconSvg()],
]);

for (const [file, svg] of svgAssets) {
  writeFileSync(file, svg);
  console.log(`generated ${file}`);
}

async function png(input, width, height = width) {
  return sharp(input, { density: 384 })
    .resize(width, height, { fit: "contain" })
    .png({ compressionLevel: 9, adaptiveFiltering: false, palette: false })
    .toBuffer();
}

const app = Buffer.from(svgAssets.get("public/brand/embir-app-icon.svg"));
const maskable = Buffer.from(
  svgAssets.get("public/brand/embir-app-icon-maskable.svg"),
);
const outputs = [
  ["public/icon-192.png", app, 192],
  ["public/icon-512.png", app, 512],
  ["public/icon-maskable-512.png", maskable, 512],
  ["public/apple-touch-icon.png", app, 180],
  ["src/app/apple-icon.png", app, 180],
  ["public/favicon-32.png", app, 32],
];

for (const [file, input, size] of outputs) {
  writeFileSync(file, await png(input, size));
  console.log(`generated ${file}`);
}

const faviconPng = await png(app, 32);
const icoHeader = Buffer.alloc(22);
icoHeader.writeUInt16LE(0, 0);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(1, 4);
icoHeader.writeUInt8(32, 6);
icoHeader.writeUInt8(32, 7);
icoHeader.writeUInt8(0, 8);
icoHeader.writeUInt8(0, 9);
icoHeader.writeUInt16LE(1, 10);
icoHeader.writeUInt16LE(32, 12);
icoHeader.writeUInt32LE(faviconPng.length, 14);
icoHeader.writeUInt32LE(22, 18);
const faviconIco = Buffer.concat([icoHeader, faviconPng]);
writeFileSync("src/app/favicon.ico", faviconIco);
writeFileSync("public/favicon.ico", faviconIco);
console.log("generated favicon.ico");

writeFileSync(
  "public/og-image.png",
  await png(Buffer.from(svgAssets.get("public/brand/embir-og.svg")), 1200, 630),
);
console.log("generated public/og-image.png");

const emailLockup = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="144" viewBox="0 0 480 144">
  <rect width="480" height="144" rx="20" fill="#2a1328"/>
  <g transform="translate(20 24)" fill="none">${pathMarkup("#f4c7d5")}</g>
  <text x="138" y="91" fill="#f2ede4" font-family="Georgia,serif" font-size="64" letter-spacing="-3">Embir</text>
</svg>`);
writeFileSync(
  "public/brand/embir-email-logo.png",
  await png(emailLockup, 240, 72),
);
console.log("generated public/brand/embir-email-logo.png");
