export const dynamic = "force-static";

const BODY = `# Embir
> Free-at-launch, inclusive dating app built on reciprocal compatibility: orientation, intention and affinity in both directions, for every orientation. Available worldwide.

## What makes Embir different
- Reciprocal compatibility: you see someone only if their preferences can include you, and yours them.
- Six intentions: love, friendship, casual, sport, going out, conversation.
- Built for every orientation: straight, gay, lesbian, bisexual, trans, queer.
- Safety first: verified profiles, human moderation, visibility controls.

## Pricing
Free at launch for founding members; transparent freemium may fund safety later.

## Key pages
- Free app: https://embir.xyz/free-dating-app
- LGBTQ+: https://embir.xyz/lgbtq-dating-app
- Safety: https://embir.xyz/verified-dating-app
- Tinder alternative: https://embir.xyz/tinder-alternative
`;

export function GET() {
  return new Response(BODY, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
