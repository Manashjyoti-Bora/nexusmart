import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Check, ShieldCheck, Truck } from "lucide-react";
import { getAllProducts, getProductBySlug } from "@/lib/products";
import { AddToCartPanel } from "@/components/add-to-cart-panel";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return { title: product.name, description: product.description.slice(0, 150) };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <article>
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-accent2">
        <ArrowLeft className="h-4 w-4" aria-hidden /> All products
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* Visual */}
        <div className="card flex h-80 items-center justify-center bg-gradient-to-br from-accent/10 via-transparent to-accent2/5 text-[9rem] lg:h-[26rem]">
          <span role="img" aria-label={product.name}>{product.emoji}</span>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2">
            <span className="badge bg-accent/15 text-accent">{product.category}</span>
            {product.stock > 0 ? (
              <span className="badge bg-emerald-500/15 text-emerald-400">In stock · {product.stock} left</span>
            ) : (
              <span className="badge bg-rose-500/15 text-rose-400">Out of stock</span>
            )}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-4 leading-relaxed text-muted">{product.description}</p>

          <ul className="mt-6 space-y-2">
            {["1-year warranty included", "7-day easy replacement", "GST invoice available"].map((line) => (
              <li key={line} className="flex items-center gap-2.5 text-sm text-muted">
                <Check className="h-4 w-4 text-emerald-400" aria-hidden /> {line}
              </li>
            ))}
          </ul>

          <AddToCartPanel product={product} />

          <div className="mt-6 flex flex-wrap gap-5 border-t border-line/60 pt-5 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Truck className="h-4 w-4" aria-hidden /> Free delivery in 3–5 days
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" aria-hidden /> Secure JWT-authenticated checkout
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
