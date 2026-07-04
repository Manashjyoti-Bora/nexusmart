"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Loader2, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart, formatINR } from "@/lib/cart-store";

type Status = "idle" | "placing" | "done";

export default function CartPage() {
  const { items, remove, setQty, clear, total } = useCart();
  const [status, setStatus] = useState<Status>("idle");
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const checkout = async () => {
    setStatus("placing");
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; orderId?: string };
      if (res.status === 401) {
        router.push("/login?next=/cart");
        return;
      }
      if (!data.ok) throw new Error(data.error ?? "Checkout failed");
      setOrderId(data.orderId ?? "");
      clear();
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStatus("idle");
    }
  };

  /* ── Success state ── */
  if (status === "done") {
    return (
      <div className="card mx-auto max-w-md p-10 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
          <Check className="h-8 w-8 text-emerald-400" aria-hidden />
        </span>
        <h1 className="mt-5 text-2xl font-bold">Order placed! 🎉</h1>
        <p className="mt-2 text-sm text-muted">
          Order ID: <span className="font-mono text-accent2">{orderId}</span>
        </p>
        <p className="mt-1 text-xs text-muted">(Mock payment — this is a portfolio demo)</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/account" className="btn-primary">View orders</Link>
          <Link href="/" className="btn-outline">Keep shopping</Link>
        </div>
      </div>
    );
  }

  /* ── Empty state ── */
  if (items.length === 0) {
    return (
      <div className="card mx-auto max-w-md p-12 text-center">
        <ShoppingCart className="mx-auto h-10 w-10 text-muted" aria-hidden />
        <h1 className="mt-4 text-xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted">Add something you&apos;ll love.</p>
        <Link href="/" className="btn-primary mt-6">
          Browse products <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    );
  }

  /* ── Cart ── */
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <section className="lg:col-span-2" aria-label="Cart items">
        <h1 className="mb-5 text-2xl font-bold">Your cart</h1>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.productId} className="card flex items-center gap-4 p-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-3xl">
                {item.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{item.name}</p>
                <p className="text-sm text-muted">{formatINR(item.price)}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setQty(item.productId, item.qty - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-line hover:border-accent/60"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  <Minus className="h-3.5 w-3.5" aria-hidden />
                </button>
                <span className="w-8 text-center text-sm font-semibold tabular-nums">{item.qty}</span>
                <button
                  onClick={() => setQty(item.productId, item.qty + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-line hover:border-accent/60"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
              <button
                onClick={() => remove(item.productId)}
                className="text-muted transition hover:text-rose-400"
                aria-label={`Remove ${item.name}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <aside className="card h-fit p-6" aria-label="Order summary">
        <h2 className="font-bold">Order summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-muted">
            <dt>Subtotal</dt>
            <dd>{formatINR(total)}</dd>
          </div>
          <div className="flex justify-between text-muted">
            <dt>Shipping</dt>
            <dd className="text-emerald-400">Free</dd>
          </div>
          <div className="flex justify-between border-t border-line/60 pt-3 text-base font-bold text-ink">
            <dt>Total</dt>
            <dd>{formatINR(total)}</dd>
          </div>
        </dl>
        {error && <p className="mt-3 text-sm text-rose-400" role="alert">{error}</p>}
        <button onClick={checkout} disabled={status === "placing"} className="btn-primary mt-5 w-full">
          {status === "placing" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Placing order…
            </>
          ) : (
            <>Checkout <ArrowRight className="h-4 w-4" aria-hidden /></>
          )}
        </button>
        <p className="mt-3 text-center text-[11px] text-muted">
          Login required · mock payment · order saved to MongoDB
        </p>
      </aside>
    </div>
  );
}
