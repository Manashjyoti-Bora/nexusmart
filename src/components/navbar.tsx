"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ShoppingBag, ShoppingCart, User as UserIcon, Wrench } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import type { SessionUser } from "@/lib/auth";

export function Navbar() {
  const { count } = useCart();
  const [user, setUser] = useState<SessionUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Re-check session on every route change (login/logout updates instantly).
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d: { user: SessionUser | null }) => setUser(d.user))
      .catch(() => setUser(null));
  }, [pathname]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-bg/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
            <ShoppingBag className="h-4 w-4" aria-hidden />
          </span>
          <span>
            Nexus<span className="text-accent">Mart</span>
          </span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {user?.role === "admin" && (
            <Link href="/admin" className="btn-outline !px-3 !py-2 text-xs" title="Admin panel">
              <Wrench className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}

          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface transition hover:border-accent/60"
            aria-label={`Cart with ${count} items`}
          >
            <ShoppingCart className="h-4 w-4" aria-hidden />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link href="/account" className="btn-outline !px-3 !py-2 text-xs">
                <UserIcon className="h-4 w-4" aria-hidden />
                <span className="hidden max-w-24 truncate sm:inline">{user.name.split(" ")[0]}</span>
              </Link>
              <button onClick={logout} className="btn-outline !px-3 !py-2 text-xs" aria-label="Log out">
                <LogOut className="h-4 w-4" aria-hidden />
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-primary !px-4 !py-2 text-xs">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
