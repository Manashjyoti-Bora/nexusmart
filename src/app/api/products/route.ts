import { NextResponse } from "next/server";
import { dbConnect, DEMO_MODE } from "@/lib/db";
import { Product } from "@/lib/models";
import { productSchema } from "@/lib/schemas";
import { getSession } from "@/lib/auth";
import { getAllProducts } from "@/lib/products";

export const runtime = "nodejs";

/** GET /api/products — public product list */
export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json({ products });
}

/** POST /api/products — ADMIN ONLY: create product */
export async function POST(req: Request) {
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  try {
    await dbConnect();
    const slug =
      parsed.data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString(36);
    const product = await Product.create({ ...parsed.data, slug });
    return NextResponse.json({ ok: true, product });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
