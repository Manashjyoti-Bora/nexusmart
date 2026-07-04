"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ShoppingCart } from "lucide-react";
import { useCart, formatINR } from "@/lib/cart-store";
import type { ProductDTO } from "@/lib/products";

export function AddToCartPanel({ product }: { product: ProductDTO }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add({ productId: product._id, name: product.name, price: product.price, emoji: product.emoji });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="mt-7 flex flex-wrap items-center gap-4">
      <span className="text-3xl font-extrabold">{formatINR(product.price)}</span>
      <button onClick={handleAdd} disabled={product.stock === 0} className="btn-primary">
        {added ? (
          <>
            <Check className="h-4 w-4" aria-hidden /> Added!
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" aria-hidden /> Add to cart
          </>
        )}
      </button>
      <Link href="/cart" className="btn-outline">
        Go to cart
      </Link>
    </div>
  );
}
