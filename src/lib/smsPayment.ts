// lib/smsPayment.ts
// Abstraction for SMS / Audiotel / Code payments

export interface PaymentCodeRequest {
  planId: string;
  userId: string;
  phone?: string;
}

export interface PaymentCodeResponse {
  success: boolean;
  code?: string;
  message: string;
  instructionUrl?: string; // If using a third-party gateway to display instructions
}

/**
 * MOCK implementation for V1.
 * In production, this will connect to providers like StarPass, Rentabiliweb, or Twilio.
 */
export async function generatePaymentCode(req: PaymentCodeRequest): Promise<PaymentCodeResponse> {
  const provider = process.env.SMS_PAYMENT_PROVIDER || "mock";
  
  if (provider === "mock") {
    // Generate a fake 6-digit code for testing
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[MOCK SMS PAYMENT] Code generated for ${req.userId}: ${code}`);
    return {
      success: true,
      code,
      message: "Envoyez CODE au 81188 (Facturé 3€). CECI EST UN MOCK DE TEST."
    };
  }

  // Future integration placeholder
  return {
    success: false,
    message: "Provider de paiement SMS non configuré en production."
  };
}

export async function verifyPaymentCode(code: string): Promise<boolean> {
  const provider = process.env.SMS_PAYMENT_PROVIDER || "mock";
  
  if (provider === "mock") {
    // In mock mode, assume any 6-digit code starting with "1" or "9" is valid, others invalid
    return code.length === 6 && (code.startsWith("1") || code.startsWith("9"));
  }

  return false;
}
