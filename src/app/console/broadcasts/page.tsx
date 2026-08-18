"use client";

import { useAuthStore, selectUser } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { hasPermission } from "@/lib/permissions";
import { useEffect } from "react";
import { BroadcastManager } from "@/components/console/broadcasts/broadcast-manager";

export default function BroadcastsPage() {
  const user = useAuthStore(selectUser);
  const router = useRouter();

  useEffect(() => {
    if (user && !hasPermission(user.role, "view_settings")) {
      router.push("/console");
    }
  }, [user, router]);

  if (!user || !hasPermission(user.role, "view_settings")) {
    return null;
  }

  return (
    <div className="container mx-auto md:p-2 p-4">
      <BroadcastManager />
    </div>
  );
}
