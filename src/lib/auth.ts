import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

/**
 * JWT auth via HTTP-only cookies.
 * - HTTP-only → JavaScript can't read the token (XSS protection)
 * - jose runs on both Node and Edge runtimes
 */

const COOKIE = "nexus_token";

function secret() {
  return new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-do-not-use-in-prod");
}

export type SessionUser = { id: string; name: string; email: string; role: "user" | "admin" };

export async function createSession(user: SessionUser) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());

  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      id: payload.id as string,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as "user" | "admin",
    };
  } catch {
    return null; // expired or tampered token
  }
}

export function destroySession() {
  cookies().delete(COOKIE);
}
