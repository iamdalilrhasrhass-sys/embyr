import { createHash } from "node:crypto";
import nodemailer, { type Transporter } from "nodemailer";

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
}

interface ResendConfig {
  apiKey: string;
  from: string;
}

type EmailProviderConfig =
  | { provider: "smtp"; config: SmtpConfig }
  | { provider: "resend"; config: ResendConfig };

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
  dedupeKey: string;
}

export interface SendEmailResult {
  providerMessageId: string | null;
}

let transporter: Transporter | null = null;
let transporterFingerprint: string | null = null;

function requiredEnv(name: string, env: NodeJS.ProcessEnv = process.env): string {
  const value = env[name]?.trim();
  if (!value) throw new Error(`${name} must be configured`);
  return value;
}

function readSmtpConfig(env: NodeJS.ProcessEnv = process.env): SmtpConfig {
  const rawPort = requiredEnv("SMTP_PORT", env);
  const port = Number(rawPort);
  if (!Number.isInteger(port) || port <= 0 || port > 65_535) {
    throw new Error("SMTP_PORT must be a valid TCP port");
  }

  const secureValue = env.SMTP_SECURE?.trim().toLowerCase();
  if (secureValue && secureValue !== "true" && secureValue !== "false") {
    throw new Error("SMTP_SECURE must be true or false when configured");
  }

  return {
    host: requiredEnv("SMTP_HOST", env),
    port,
    secure: secureValue ? secureValue === "true" : port === 465,
    user: requiredEnv("SMTP_USER", env),
    pass: requiredEnv("SMTP_PASS", env),
    from: requiredEnv("SMTP_FROM", env),
  };
}

function readEmailProviderConfig(env: NodeJS.ProcessEnv = process.env): EmailProviderConfig {
  const provider = (env.EMAIL_PROVIDER?.trim().toLowerCase() || "smtp");
  if (provider === "smtp") return { provider, config: readSmtpConfig(env) };
  if (provider === "resend") {
    return {
      provider,
      config: {
        apiKey: requiredEnv("RESEND_API_KEY", env),
        from: requiredEnv("RESEND_FROM", env),
      },
    };
  }
  throw new Error("EMAIL_PROVIDER must be smtp or resend");
}

export function getRequiredAdminReportEmail(
  env: NodeJS.ProcessEnv = process.env,
): string {
  const email = requiredEnv("ADMIN_REPORT_EMAIL", env);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("ADMIN_REPORT_EMAIL must be a valid email address");
  }
  return email;
}

function getTransporter(): { transporter: Transporter; config: SmtpConfig } {
  const config = readSmtpConfig();
  const fingerprint = createHash("sha256")
    .update(
      `${config.host}:${config.port}:${config.secure}:${config.user}:${config.pass}:${config.from}`,
    )
    .digest("hex");

  if (!transporter || transporterFingerprint !== fingerprint) {
    transporter?.close();
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass },
      pool: true,
      maxConnections: 3,
      maxMessages: 100,
    });
    transporterFingerprint = fingerprint;
  }

  return { transporter, config };
}

function deterministicMessageId(dedupeKey: string, from: string): string {
  const domain = from.match(/@([^>\s]+)>?$/)?.[1];
  if (!domain) throw new Error("SMTP_FROM must contain a valid domain");
  const digest = createHash("sha256").update(dedupeKey).digest("hex");
  return `<${digest}@${domain}>`;
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  if (!input.html.trim() || !input.text.trim()) {
    throw new Error("Email delivery requires both HTML and plain-text content");
  }
  const provider = readEmailProviderConfig();
  if (provider.provider === "resend") {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${provider.config.apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": input.dedupeKey,
      },
      body: JSON.stringify({
        from: provider.config.from,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) throw new Error(`Resend API request failed with status ${response.status}`);
    const body = await response.json() as { id?: unknown };
    if (typeof body.id !== "string" || !body.id.trim() || body.id.length > 200) {
      throw new Error("Resend API returned an invalid response");
    }
    return { providerMessageId: body.id };
  }

  const { transporter: smtp, config } = getTransporter();
  const info = await smtp.sendMail({
    from: config.from,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    messageId: deterministicMessageId(input.dedupeKey, config.from),
  });
  return {
    providerMessageId:
      typeof info.messageId === "string" ? info.messageId : null,
  };
}

export function closeSmtpTransport(): void {
  transporter?.close();
  transporter = null;
  transporterFingerprint = null;
}
