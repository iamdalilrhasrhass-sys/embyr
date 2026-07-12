/**
 * SMS Service for embir.xyz
 * Uses a lazily initialized Twilio client and fails closed in production.
 */

interface SmsClient {
  messages: {
    create(input: { body: string; from: string; to: string }): Promise<unknown>;
  };
}

let twilioClientPromise: Promise<SmsClient | null> | null = null;

async function getTwilioClient(): Promise<SmsClient | null> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken || !process.env.TWILIO_PHONE_NUMBER) return null;
  twilioClientPromise ??= import("twilio")
    .then(({ default: createTwilioClient }) => createTwilioClient(accountSid, authToken) as SmsClient)
    .catch(() => {
      console.error("[sms] Twilio initialization failed");
      return null;
    });
  return twilioClientPromise;
}

export async function sendSmsCode(
  phone: string,
  code: string,
): Promise<{ success: boolean; message: string }> {
  const client = await getTwilioClient();
  if (!client) {
    if (process.env.NODE_ENV === "development") {
      return { success: true, message: "Mode de développement" };
    }
    return {
      success: false,
      message: "Service SMS indisponible",
    };
  }

  try {
    const from = process.env.TWILIO_PHONE_NUMBER;
    if (!from) return { success: false, message: "Service SMS indisponible" };
    await client.messages.create({
      body: `embir.xyz : ton code de vérification est ${code}. Il expire dans 5 minutes.`,
      from,
      to: phone,
    });
    return { success: true, message: "Code envoyé par SMS" };
  } catch {
    console.error("[sms] Delivery failed");
    return { success: false, message: "Erreur d'envoi SMS. Vérifie ton numéro." };
  }
}
