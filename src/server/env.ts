import "server-only";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().min(1, "DIRECT_URL is required"),
  ENCRYPTION_KEY: z.string().length(64, "ENCRYPTION_KEY must be a 32-byte hex string (64 characters)"),
  KUJERA_FLW_SECRET_KEY: z.string().min(1, "KUJERA_FLW_SECRET_KEY is required"),
  KUJERA_FLW_WEBHOOK_SECRET: z.string().min(1, "KUJERA_FLW_WEBHOOK_SECRET is required"),
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  CRON_SECRET: z.string().min(1, "CRON_SECRET is required"),
  APP_URL: z.string().url("APP_URL must be a valid URL"),
  EMAIL_API_KEY: z.string().optional().default(""),
  EMAIL_FROM: z.string().min(1, "EMAIL_FROM is required").default("hello@kujera.app"),
  RATE_LIMIT_SALT: z.string().min(16, "RATE_LIMIT_SALT must be at least 16 characters"),
});

export type Env = z.infer<typeof envSchema>;

function getEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Environment validation failed:\n${issues}`);
  }
  return parsed.data;
}

export const env = getEnv();

