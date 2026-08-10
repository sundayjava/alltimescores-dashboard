"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, selectUser } from "@/stores/auth-store";
import { hasPermission } from "@/lib/permissions";
import { PageHeader } from "@/components/console/Pageheader";
import { MediaManager } from "@/components/console/content/media/media";

export default function MediaPage() {
  const user = useAuthStore(selectUser);
  const router = useRouter();

  useEffect(() => {
    if (user && !hasPermission(user.role, "view_content")) {
      router.push("/console");
    }
  }, [user, router]);

  if (!user || !hasPermission(user.role, "view_content")) return null;

  return (
    <div className="container mx-auto md:p-2 p-4">
      <MediaManager />
    </div>
  );
}