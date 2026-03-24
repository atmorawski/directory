import { config as loadEnv } from "dotenv";
import { z } from "zod";

loadEnv();

const envSchema = z.object({
  SLACK_BOT_TOKEN: z.string().min(1),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_SECURE: z
    .string()
    .default("false")
    .transform((value) => value.toLowerCase() === "true"),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  EMAIL_FROM: z.string().min(1),
  EMAIL_TO: z.string().email(),
  CSV_FILENAME: z.string().min(1).default("slack-public-channels.csv"),
});

export const env = envSchema.parse(process.env);
