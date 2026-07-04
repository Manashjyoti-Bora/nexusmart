import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card mx-auto max-w-md p-12 text-center">
      <p className="text-6xl font-extrabold text-accent">404</p>
      <h1 className="mt-3 text-xl font-bold">Page not found</h1>
      <p className="mt-2 text-sm text-muted">This aisle doesn&apos;t exist in our store.</p>
      <Link href="/" className="btn-primary mt-6">Back to shop</Link>
    </div>
  );
}
