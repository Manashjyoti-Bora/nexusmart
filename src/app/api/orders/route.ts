import { NextResponse } from "next/server";
import { dbConnect, DEMO_MODE } from "@/lib/db";
import { Order } from "@/lib/models";
import { orderSchema } from "@/lib/schemas";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

/** GET /api/orders — logged-in user's order history */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Login required" }, { status: 401 });
  }
  if (DEMO_MODE) return NextResponse.json({ ok: true, orders: [] });

  try {
    await dbConnect();
    const orders = await Order.find({ userId: session.id }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      ok: true,
      orders: orders.map((o) => ({
        id: String(o._id),
        items: o.items,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt,
      })),
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

/** POST /api/orders — place order (mock payment) */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Please log in to checkout" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid order" },
      { status: 400 },
    );
  }

  // Total is computed SERVER-SIDE from submitted items — never trust client totals.
  const total = parsed.data.items.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (DEMO_MODE) {
    return NextResponse.json({ ok: true, demo: true, orderId: "demo-" + Date.now().toString(36), total });
  }

  try {
    await dbConnect();
    const order = await Order.create({ userId: session.id, items: parsed.data.items, total });
    return NextResponse.json({ ok: true, orderId: String(order._id), total });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
