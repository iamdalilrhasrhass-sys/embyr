/**
 * Hermes AI Client — DeepSeek V4 Pro
 * Moteur de toutes les fonctionnalités IA d'Embir
 */
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "sk-6877182a9be345ecb73806940a27d0c8";
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1";

export async function hermesAI(prompt: string, system?: string): Promise<string> {
  const res = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: system || "Tu es Hermes, l'IA de Embir.xyz, une app de rencontre gay nouvelle génération. Tu es provocateur, expert en psychologie sociale, drôle et incisif. Tu réponds en français." },
        { role: "user", content: prompt },
      ],
      max_tokens: 800,
      temperature: 0.8,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

export async function hermesAIJSON<T>(prompt: string, system?: string): Promise<T> {
  const raw = await hermesAI(prompt + "\n\nRéponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans commentaires.", system);
  // Nettoie les éventuels backticks markdown
  const clean = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(clean) as T;
}
