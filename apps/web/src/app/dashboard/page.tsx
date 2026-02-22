"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    const role = (session?.user as any)?.role;
    if (role === "SUPERADMIN") router.replace("/dashboard/superadmin");
    else if (role === "ADMIN") router.replace("/dashboard/admin");
    else router.replace("/dashboard/user");
  }, [session, status, router]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ width: "40px", height: "40px", border: "3px solid var(--border)", borderTopColor: "var(--text-primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
