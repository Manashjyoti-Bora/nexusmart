"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useCart, formatINR } from "@/lib/cart-store";
import type { ProductDTO } from "@/lib/products";

export function ProductCard({ product }: { product: ProductDTO }) {
  const { add } = useCart();

  return (
    <div className="card group relative overflow-hidden">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="flex h-40 items-center justify-center bg-gradient-to-br from-accent/10 via-transparent to-accent2/5 text-7xl transition-transform duration-500 group-hover:scale-110">
          <span role="img" aria-label={product.name}>
            {product.emoji}
          </span>
        </div>
        <div className="p-4">
          <div className="mb-1 flex items-center gap-2">
            <span className="badge bg-accent/15 text-accent">{product.category}</span>
            {product.featured && <span className="badge bg-accent2/15 text-accent2">Featured</span>}
          </div>
          <h3 className="font-semibold leading-snug group-hover:text-accent2">{product.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted">{product.description}</p>
        </div>
      </Link>
      <div className="flex items-center justify-between border-t border-line/60 p-4">
        <span className="font-bold">{formatINR(product.price)}</span>
        <button
          onClick={() =>
            add({ productId: product._id, name: product.name, price: product.price, emoji: product.emoji })
          }
          className="btn-primary !px-3.5 !py-2 text-xs"
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Add
        </button>
      </div>
    </div>
  );
}
