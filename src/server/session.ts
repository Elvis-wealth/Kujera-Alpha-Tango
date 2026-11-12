import "server-only";
import { cookies } from "next/headers";
import crypto from "crypto";
import { authSession, AuthSessionResult } from "./db";

export const SESSION_COOKIE_NAME = "kj_session";

export interface ResolvedSession {
  sessionId: string;
  userId: string;
  email: string;
  organisationId: string;
  memberId: string | null;
  staffId: string | null;
  role: "MEMBER" | "DESK" | "OWNER";
}

/**
 * Hashes a plain token string using SHA-256 to lookup the session.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Resolves the session from the HTTP-only cookie.
 * Returns null if the cookie is missing or invalid.
 */
export async function getSession(): Promise<ResolvedSession | null> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!rawToken) {
    return null;
  }

  const tokenHash = hashToken(rawToken);
  const result: AuthSessionResult | null = await authSession(tokenHash);

  if (!result || (result.role !== "MEMBER" && result.role !== "DESK" && result.role !== "OWNER")) {
    return null;
  }

  return {
    sessionId: result.sessionId,
    userId: result.userId,
    email: result.email,
    organisationId: result.organisationId,
    memberId: result.memberId,
    staffId: result.staffId,
    role: result.role,
  };
}

/**
 * Requires an active session. Throws a 401 error response payload if unauthenticated.
 */
export async function requireSession(): Promise<ResolvedSession> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

