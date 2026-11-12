import "server-only";
import { PrismaClient } from "@prisma/client";

// Global single instance of raw client (internal to this module only)
const globalForPrisma = globalThis as unknown as {
  rawPrisma: PrismaClient | undefined;
};

const rawPrisma =
  globalForPrisma.rawPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.rawPrisma = rawPrisma;
}

export type SessionRole = "MEMBER" | "DESK" | "OWNER" | "WEBHOOK" | "SYSTEM";

export interface SessionContext {
  organisationId: string;
  userId: string;
  memberId?: string | null;
  role: SessionRole;
}

/**
 * Creates an RLS-scoped transaction.
 * Sets app.org_id, app.user_id, app.member_id, and app.role with is_local=true.
 * Every query executed against the returned client is scoped to that transaction.
 */
export async function withRLS<T>(
  context: SessionContext,
  fn: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  return rawPrisma.$transaction(async (tx) => {
    await tx.$executeRaw`
      SELECT
        set_config('app.org_id', ${context.organisationId}, true),
        set_config('app.user_id', ${context.userId}, true),
        set_config('app.member_id', ${context.memberId ?? ""}, true),
        set_config('app.role', ${context.role}, true)
    `;
    return fn(tx as unknown as PrismaClient);
  });
}

/**
 * System-scoped transaction for webhooks (after signature verification) and cron jobs.
 */
export async function withSystemRLS<T>(
  organisationId: string,
  fn: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  return rawPrisma.$transaction(async (tx) => {
    await tx.$executeRaw`
      SELECT
        set_config('app.org_id', ${organisationId}, true),
        set_config('app.user_id', '', true),
        set_config('app.member_id', '', true),
        set_config('app.role', 'SYSTEM', true)
    `;
    return fn(tx as unknown as PrismaClient);
  });
}

// ============================================================================
// SECURITY DEFINER Function Wrappers
// Reference: .agents/rules/security-rls.md
// ============================================================================

export interface AuthSessionResult {
  sessionId: string;
  userId: string;
  email: string;
  organisationId: string;
  memberId: string | null;
  staffId: string | null;
  role: SessionRole;
}

export async function authSession(sessionTokenHash: string): Promise<AuthSessionResult | null> {
  const rows = await rawPrisma.$queryRaw<AuthSessionResult[]>`
    SELECT * FROM auth_session(${sessionTokenHash})
  `;
  return rows[0] ?? null;
}

export async function orgPaymentSecret(organisationId: string): Promise<string | null> {
  const rows = await rawPrisma.$queryRaw<{ secret: string }[]>`
    SELECT org_payment_secret(${organisationId}) as secret
  `;
  return rows[0]?.secret ?? null;
}

export async function orgWebhookSecret(organisationId: string): Promise<string | null> {
  const rows = await rawPrisma.$queryRaw<{ secret: string }[]>`
    SELECT org_webhook_secret(${organisationId}) as secret
  `;
  return rows[0]?.secret ?? null;
}

export async function orgSubscriptionStatus(organisationId: string): Promise<boolean> {
  const rows = await rawPrisma.$queryRaw<{ is_active: boolean }[]>`
    SELECT org_subscription_status(${organisationId}) as is_active
  `;
  return rows[0]?.is_active ?? false;
}

