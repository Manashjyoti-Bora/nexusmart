"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock, Mail, User } from "lucide-react";
import { loginSchema, signupSchema } from "@/lib/schemas";

/** Shared login/signup form with client-side Zod validation. */
export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation first (same schema the server uses).
    const schema = mode === "signup" ? signupSchema : loginSchema;
    const input = mode === "signup" ? { name, email, password } : { email, password };
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) throw new Error(data.error ?? "Something went wrong");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="card mx-auto mt-6 w-full max-w-md p-8">
      <h1 className="text-2xl font-bold">{mode === "signup" ? "Create your account" : "Welcome back"}</h1>
      <p className="mt-1 text-sm text-muted">
        {mode === "signup" ? "Join NexusMart in 10 seconds." : "Log in to checkout and view orders."}
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        {mode === "signup" && (
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              autoComplete="name"
              aria-label="Full name"
              className="input !pl-10"
            />
          </div>
        )}
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email address"
            autoComplete="email"
            aria-label="Email address"
            className="input !pl-10"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder={mode === "signup" ? "Password (min 8 characters)" : "Password"}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            aria-label="Password"
            className="input !pl-10"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-400" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Please wait…
            </>
          ) : mode === "signup" ? (
            "Create account"
          ) : (
            "Log in"
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-accent2 hover:underline">Log in</Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/signup" className="text-accent2 hover:underline">Create an account</Link>
          </>
        )}
      </p>
    </div>
  );
}
