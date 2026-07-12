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

/** Fail closed until a signed provider callback and persisted payment intent exist. */
export async function generatePaymentCode(_req: PaymentCodeRequest): Promise<PaymentCodeResponse> {
  void _req;
  return {
    success: false,
    message: "Paiement SMS désactivé."
  };
}

export async function verifyPaymentCode(_code: string): Promise<boolean> {
  void _code;
  return false;
}
