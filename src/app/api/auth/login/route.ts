import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect, DEMO_MODE } from "@/lib/db";
import { User } from "@/lib/models";
import { loginSchema } from "@/lib/schemas";
import { createSession } from "@/lib/auth";

export const runtime = "nodejs";

/** Simple per-IP rate limit: 10 attempts / 10 min (brute-force guard). */
const attempts = new Map<string, { count: number; reset: number }>();
function limited(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.reset) {
    attempts.set(ip, { count: 1, reset: now + 10 * 60 * 1000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 10;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (limited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts — try again in 10 minutes" },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  if (DEMO_MODE) {
    await createSession({
      id: "demo-user",
      name: parsed.data.email.split("@")[0] ?? "Demo User",
      email: parsed.data.email,
      role: parsed.data.email === process.env.ADMIN_EMAIL ? "admin" : "user",
    });
    return NextResponse.json({ ok: true, demo: true });
  }

  try {
    await dbConnect();
    const user = await User.findOne({ email: parsed.data.email });
    // Same error for wrong email vs wrong password — never leak which.
    if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
      return NextResponse.json({ ok: false, error: "Invalid email or password" }, { status: 401 });
    }
    await createSession({
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error — try again" }, { status: 500 });
  }
}
