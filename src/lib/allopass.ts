/**
 * Allopass Payment Service
 * Paiement par SMS+ et Audiotel (numéro surtaxé)
 * Documentation: https://developer.allopass.com/
 *
 * Fonctionne avec Allopass OneClick API
 */

export interface AllopassConfig {
  apiKey: string;
  secretKey: string;
  siteId: string;
  environment: "test" | "production";
}

const config: AllopassConfig | null = (() => {
  const key = process.env.ALLOPASS_API_KEY;
  const secret = process.env.ALLOPASS_SECRET_KEY;
  const siteId = process.env.ALLOPASS_SITE_ID;
  if (!key || !secret || !siteId) return null;
  return {
    apiKey: key,
    secretKey: secret,
    siteId,
    environment: (process.env.ALLOPASS_ENV as "test" | "production") || "test",
  };
})();

const BASE_URL = config?.environment === "production"
  ? "https://api.allopass.com/v2"
  : "https://api-sandbox.allopass.com/v2";

const FRONTEND_URL = process.env.FRONTEND_URL || "https://feminia.xyz";

interface AllopassPaymentRequest {
  amount: number;       // en centimes (ex: 499 = 4,99€)
  currency: string;     // "EUR"
  country: string;      // "FR"
  description: string;  // Nom du produit
  reference: string;    // Référence interne (ex: userId_plan_timestamp)
  returnUrl: string;    // URL de retour après paiement
  notifyUrl: string;    // Webhook URL for notification
  paymentMethods: ("sms" | "audiotel" | "cb")[];
  endUserId?: string;   // Identifiant de l'utilisateur
  email?: string;
}

interface AllopassPaymentResponse {
  transactionId: string;
  paymentUrl: string;           // URL hosted Allopass
  instructions?: {
    sms?: { keyword: string; shortCode: string; cost: string };
    audiotel?: { phoneNumber: string; costPerMinute: string };
  };
  status: "pending" | "completed" | "failed";
  error?: string;
}

export function isAllopassConfigured(): boolean {
  return config !== null;
}

/**
 * Crée une transaction Allopass
 */
export async function createPayment(req: AllopassPaymentRequest): Promise<AllopassPaymentResponse> {
  if (!config) {
    throw new Error("Allopass non configuré. Vérifiez ALLOPASS_API_KEY dans le .env");
  }

  const payload = {
    site_id: config.siteId,
    amount: req.amount,
    currency: req.currency || "EUR",
    country: req.country || "FR",
    description: req.description,
    reference: req.reference,
    return_url: req.returnUrl,
    notify_url: req.notifyUrl,
    payment_methods: req.paymentMethods || ["sms", "audiotel"],
    end_user_id: req.endUserId,
    email: req.email,
  };

  const signature = generateSignature(payload, config.secretKey);

  try {
    const response = await fetch(`${BASE_URL}/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": config.apiKey,
        "X-Signature": signature,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Allopass API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return {
      transactionId: data.transaction_id,
      paymentUrl: data.payment_url,
      instructions: data.instructions,
      status: data.status || "pending",
    };
  } catch (error) {
    console.error("[Allopass] createPayment error:", error);
    throw error;
  }
}

/**
 * Vérifie le statut d'une transaction
 */
export async function checkTransaction(transactionId: string): Promise<AllopassPaymentResponse> {
  if (!config) throw new Error("Allopass non configuré");

  try {
    const response = await fetch(`${BASE_URL}/payment/${transactionId}`, {
      headers: {
        "X-Api-Key": config.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Allopass API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      transactionId: data.transaction_id,
      paymentUrl: "",
      status: data.status,
    };
  } catch (error) {
    console.error("[Allopass] checkTransaction error:", error);
    throw error;
  }
}

/**
 * Génère une signature HMAC-SHA256 pour sécuriser les requêtes
 */
function generateSignature(payload: Record<string, any>, secret: string): string {
  const sortedKeys = Object.keys(payload).sort();
  const sortedPayload: Record<string, any> = {};
  for (const key of sortedKeys) {
    sortedPayload[key] = payload[key];
  }
  
  const crypto = require("crypto");
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(JSON.stringify(sortedPayload));
  return hmac.digest("hex");
}

// Mapping des plans Embyr vers Allopass
export const ALLOPASS_PLANS: Record<string, { amount: number; description: string }> = {
  "decouverte_24h":  { amount: 249,  description: "Découverte 24h - Embyr" },
  "premium_1w":      { amount: 499,  description: "Premium 1 semaine - Embyr" },
  "premium_1m":      { amount: 1499, description: "Premium 1 mois - Embyr" },
  "premium_3m":      { amount: 2999, description: "Premium 3 mois - Embyr" },
  "premium_12m":     { amount: 4999, description: "Premium 12 mois - Embyr" },
  "boost_24h":       { amount: 99,   description: "Boost profil 24h - Embyr" },
  "highlight_7d":    { amount: 6999, description: "VIP 1 an - Embyr" },
};
