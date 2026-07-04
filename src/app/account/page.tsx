import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Package, ShieldCheck, User as UserIcon } from "lucide-react";
import { getSession } from "@/lib/auth";
import { dbConnect, DEMO_MODE } from "@/lib/db";
import { Order } from "@/lib/models";

export const metadata: Metadata = { title: "My account" };
export const dynamic = "force-dynamic"; // session-dependent page

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/account"); // protected route

  let orders: { id: string; items: { name: string; qty: number; emoji: string }[]; total: number; status: string; createdAt: Date }[] = [];
  if (!DEMO_MODE) {
    try {
      await dbConnect();
      const docs = await Order.find({ userId: session.id }).sort({ createdAt: -1 }).lean();
      orders = docs.map((o) => ({
        id: String(o._id),
        items: o.items.map((i) => ({ name: i.name ?? "", qty: i.qty ?? 1, emoji: i.emoji ?? "📦" })),
        total: o.total,
        status: o.status,
        createdAt: o.createdAt,
      }));
    } catch {
      /* DB unreachable — show empty history */
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Profile card */}
      <div className="card flex items-center gap-4 p-6">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
          <UserIcon className="h-6 w-6" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold">{session.name}</h1>
          <p className="truncate text-sm text-muted">{session.email}</p>
        </div>
        {session.role === "admin" && (
          <span className="badge bg-amber-500/15 text-amber-400">
            <ShieldCheck className="mr-1 h-3 w-3" aria-hidden /> Admin
          </span>
        )}
      </div>

      {/* Order history */}
      <h2 className="mb-4 mt-10 flex items-center gap-2 text-lg font-bold">
        <Package className="h-5 w-5 text-accent" aria-hidden /> Order history
      </h2>

      {orders.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-semibold">No orders yet</p>
          <p className="mt-1 text-sm text-muted">
            {DEMO_MODE ? "Demo mode — connect MongoDB to persist orders." : "Your orders will appear here after checkout."}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs text-muted">#{order.id.slice(-8)}</span>
                <span
                  className={`badge ${
                    order.status === "delivered"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : order.status === "shipped"
                        ? "bg-accent2/15 text-accent2"
                        : "bg-accent/15 text-accent"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted">
                {order.items.map((i) => `${i.emoji} ${i.name} ×${i.qty}`).join(" · ")}
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-3 text-sm">
                <time className="text-muted">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </time>
                <span className="font-bold">{formatINR(order.total)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
