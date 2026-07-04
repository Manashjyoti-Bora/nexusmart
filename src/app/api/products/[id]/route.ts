import { NextResponse } from "next/server";
import { dbConnect, DEMO_MODE } from "@/lib/db";
import { Product } from "@/lib/models";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

/** DELETE /api/products/[id] — ADMIN ONLY */
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ ok: false, error: "Admin access required" }, { status: 403 });
  }
  if (DEMO_MODE) {
    return NextResponse.json(
      { ok: false, error: "Demo mode — connect MongoDB to manage products" },
      { status: 400 },
    );
  }
  try {
    await dbConnect();
    await Product.findByIdAndDelete(params.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
