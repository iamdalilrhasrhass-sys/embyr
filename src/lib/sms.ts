/**
 * SMS Service for embir.xyz
 * Uses Twilio when configured, falls back to console.log in dev
 */

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER; // +33...
const NODE_ENV = process.env.NODE_ENV || "development";

let twilioClient: any = null;

try {
  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
    const twilio = require("twilio");
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }
} catch (e) {
  console.warn("[sms] Twilio init failed:", (e as Error).message);
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
}

export async function sendSmsCode(phone: string): Promise<{ success: boolean; code?: string; message: string }> {
  const code = generateCode();

  if (!twilioClient) {
    console.log(`[sms] ⚠️ Twilio not configured. Would send code ${code} to ${phone}`);
    return {
      success: true,
      code, // Return code directly in dev so FE can auto-fill
      message: NODE_ENV === "development"
        ? `Code de vérification : ${code}`
        : "SMS non configuré (mode dev)",
    };
  }

  // Format phone for Twilio (French numbers)
  const formattedPhone = phone.startsWith("0") ? `+33${phone.slice(1)}` : phone.startsWith("+") ? phone : `+33${phone}`;

  try {
    const message = await twilioClient.messages.create({
      body: `embir.xyz : ton code de vérification est ${code}. Il expire dans 5 minutes.`,
      from: TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log(`[sms] ✅ Code sent to ${formattedPhone}, sid=${message.sid}`);
    return { success: true, message: "Code envoyé par SMS" };
  } catch (e: any) {
    console.error("[sms] Failed to send:", e.message);
    return { success: false, message: "Erreur d'envoi SMS. Vérifie ton numéro." };
  }
}

export function verifyCode(inputCode: string, storedCode: string): boolean {
  return inputCode === storedCode;
}
