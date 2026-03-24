import nodemailer from "nodemailer";

import { env } from "./config";

const transport = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export type MailResult = {
  accepted: string[];
  rejected: string[];
  messageId: string;
  response: string;
};

function normalizeAddressList(addresses: Array<string | { address: string }>): string[] {
  return addresses.map((entry) => (typeof entry === "string" ? entry : entry.address));
}

export async function sendCsvEmail(csvContent: string, channelCount: number): Promise<MailResult> {
  const reportDate = new Date().toISOString();

  const result = await transport.sendMail({
    from: env.EMAIL_FROM,
    to: env.EMAIL_TO,
    subject: `Slack public channels export (${channelCount})`,
    text: [
      "Automatyczny eksport publicznych kanalow Slacka jest w zalaczniku.",
      `Liczba kanalow: ${channelCount}`,
      `Wygenerowano: ${reportDate}`,
    ].join("\n"),
    attachments: [
      {
        filename: env.CSV_FILENAME,
        content: csvContent,
        contentType: "text/csv; charset=utf-8",
      },
    ],
  });

  return {
    accepted: normalizeAddressList(result.accepted),
    rejected: normalizeAddressList(result.rejected),
    messageId: result.messageId,
    response: result.response,
  };
}
