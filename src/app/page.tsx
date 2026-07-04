import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Zap } from "lucide-react";
import { getAllProducts } from "@/lib/products";
import { ProductGrid } from "@/components/product-grid";

export const revalidate = 60; // refresh product list every minute

export default async function HomePage() {
  const products = await getAllProducts();

  return (
    <>
      {/* Hero */}
      <section className="card relative mb-12 overflow-hidden p-8 text-center sm:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(600px circle at 50% 0%, rgb(99 102 241 / 0.18), transparent 60%)",
          }}
        />
        <span className="badge relative bg-accent2/15 text-accent2">⚡ Premium tech, honest prices</span>
        <h1 className="relative mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Gear that makes you <span className="text-accent">faster</span>
        </h1>
        <p className="relative mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          NexusMart is a full-stack e-commerce build — real authentication, real database, real
          checkout flow. Browse the catalog, add to cart, and experience the whole product.
        </p>
        <div className="relative mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href="#products" className="btn-primary">
            Shop now <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link href="/signup" className="btn-outline">
            Create account
          </Link>
        </div>
      </section>

      {/* Trust strip */}
      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: <Truck className="h-5 w-5" aria-hidden />, title: "Free shipping", body: "On every order, everywhere in India" },
          { icon: <ShieldCheck className="h-5 w-5" aria-hidden />, title: "Secure checkout", body: "JWT auth + server-side validation" },
          { icon: <Zap className="h-5 w-5" aria-hidden />, title: "Instant experience", body: "Optimistic cart, zero page reloads" },
        ].map((f) => (
          <div key={f.title} className="card flex items-center gap-4 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
              {f.icon}
            </span>
            <div>
              <p className="text-sm font-semibold">{f.title}</p>
              <p className="text-xs text-muted">{f.body}</p>
            </div>
          </div>
        ))}
      </div>

      <ProductGrid products={products} />
    </>
  );
}
