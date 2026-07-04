"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Wrench } from "lucide-react";
import { formatINR } from "@/lib/cart-store";
import type { ProductDTO } from "@/lib/products";

/** Admin product CRUD: list, create, delete — talks to the admin APIs. */
export function AdminPanel() {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Accessories",
    emoji: "📦",
    stock: "100",
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = (await res.json()) as { products: ProductDTO[] };
      setProducts(data.products);
    } catch {
      setMsg({ kind: "err", text: "Failed to load products" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock) }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) throw new Error(data.error ?? "Failed");
      setMsg({ kind: "ok", text: "Product created ✓" });
      setForm({ name: "", description: "", price: "", category: "Accessories", emoji: "📦", stock: "100" });
      void load();
    } catch (err) {
      setMsg({ kind: "err", text: err instanceof Error ? err.message : "Failed to create" });
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) throw new Error(data.error ?? "Failed");
      setMsg({ kind: "ok", text: "Product deleted ✓" });
      void load();
    } catch (err) {
      setMsg({ kind: "err", text: err instanceof Error ? err.message : "Failed to delete" });
    }
  };

  return (
    <div>
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <Wrench className="h-6 w-6 text-accent" aria-hidden /> Admin panel
      </h1>
      <p className="mt-1 text-sm text-muted">Create and manage the product catalog (admin-only APIs).</p>

      {msg && (
        <p
          role="status"
          className={`mt-4 rounded-lg px-3 py-2 text-sm ${
            msg.kind === "ok" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
          }`}
        >
          {msg.text}
        </p>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* Create form */}
        <form onSubmit={createProduct} className="card h-fit space-y-4 p-6">
          <h2 className="font-bold">Add product</h2>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Product name"
            aria-label="Product name"
            className="input"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description (min 10 characters)"
            aria-label="Description"
            rows={3}
            className="input resize-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Price (₹)"
              inputMode="numeric"
              aria-label="Price in rupees"
              className="input"
            />
            <input
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              placeholder="Stock"
              inputMode="numeric"
              aria-label="Stock quantity"
              className="input"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              aria-label="Category"
              className="input"
            >
              {["Audio", "Wearables", "Accessories", "Cameras"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input
              value={form.emoji}
              onChange={(e) => setForm({ ...form, emoji: e.target.value })}
              placeholder="Emoji (e.g. 🎧)"
              aria-label="Product emoji"
              className="input"
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Saving…
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" aria-hidden /> Create product
              </>
            )}
          </button>
        </form>

        {/* Product list */}
        <div>
          <h2 className="mb-3 font-bold">Catalog ({products.length})</h2>
          {loading ? (
            <div className="card flex items-center justify-center p-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted" aria-hidden />
            </div>
          ) : (
            <ul className="space-y-2">
              {products.map((p) => (
                <li key={p._id} className="card flex items-center gap-3 p-3.5">
                  <span className="text-2xl">{p.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-muted">
                      {formatINR(p.price)} · {p.category} · stock {p.stock}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteProduct(p._id, p.name)}
                    className="text-muted transition hover:text-rose-400"
                    aria-label={`Delete ${p.name}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
