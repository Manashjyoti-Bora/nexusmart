import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { AdminPanel } from "@/components/admin-panel";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

/** Server-side role gate — non-admins never even see this page. */
export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");
  if (session.role !== "admin") redirect("/");
  return <AdminPanel />;
}
