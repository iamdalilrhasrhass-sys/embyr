/** Shared DeepSeek client. Credentials are required at runtime and never fall back to source code. */
function deepSeekConfig(): { apiKey: string; baseUrl: string } {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY must be configured");

  const configuredUrl = process.env.DEEPSEEK_BASE_URL?.trim() || "https://api.deepseek.com/v1";
  const url = new URL(configuredUrl);
  if (url.protocol !== "https:") throw new Error("DEEPSEEK_BASE_URL must use HTTPS");
  return { apiKey, baseUrl: url.toString().replace(/\/$/, "") };
}

export async function hermesAI(prompt: string, system?: string): Promise<string> {
  const cleanPrompt = prompt.trim().slice(0, 8_000);
  if (!cleanPrompt) throw new Error("AI prompt is required");
  const { apiKey, baseUrl } = deepSeekConfig();

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: system?.trim().slice(0, 4_000) ||
            "Tu es Hermes, l’assistant d’Embir. Réponds avec bienveillance, sans manipuler, sans diagnostiquer et sans inventer de faits.",
        },
        { role: "user", content: cleanPrompt },
      ],
      max_tokens: 800,
      temperature: 0.7,
    }),
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API request failed with status ${response.status}`);
  }

  const data = await response.json() as {
    choices?: Array<{ message?: { content?: unknown } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("DeepSeek API returned an invalid response");
  }
  return content.trim();
}

export async function hermesAIJSON<T>(prompt: string, system?: string): Promise<T> {
  const raw = await hermesAI(
    `${prompt}\n\nRéponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans commentaires.`,
    system,
  );
  const clean = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(clean) as T;
}
