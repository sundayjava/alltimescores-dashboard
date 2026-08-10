"use client";

import { useAuthStore, selectUser } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { hasPermission } from "@/lib/permissions";
import { useEffect } from "react";
import { PageHeader } from "@/components/console/Pageheader";
import { TagManager } from "@/components/console/content/tags/tag";

export default function TagsPage() {
  const user = useAuthStore(selectUser);
  const router = useRouter();

  useEffect(() => {
    if (user && !hasPermission(user.role, "manage_tags")) {
      router.push("/console");
    }
  }, [user, router]);

  if (!user || !hasPermission(user.role, "manage_tags")) {
    return null;
  }

  return (
    <div className="container mx-auto md:p-2 p-4">
      <TagManager />
    </div>
  );
}