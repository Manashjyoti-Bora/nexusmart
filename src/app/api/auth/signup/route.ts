import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect, DEMO_MODE } from "@/lib/db";
import { User } from "@/lib/models";
import { signupSchema } from "@/lib/schemas";
import { createSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  if (DEMO_MODE) {
    // No database configured → demo session so the full flow is testable.
    await createSession({
      id: "demo-user",
      name: parsed.data.name,
      email: parsed.data.email,
      role: "user",
    });
    return NextResponse.json({ ok: true, demo: true });
  }

  try {
    await dbConnect();
    const { name, email, password } = parsed.data;

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { ok: false, error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const role = email === process.env.ADMIN_EMAIL ? "admin" : "user";
    const user = await User.create({ name, email, passwordHash, role });

    await createSession({ id: String(user._id), name, email, role });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error — try again" }, { status: 500 });
  }
}
