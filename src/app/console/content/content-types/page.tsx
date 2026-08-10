"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, selectUser } from "@/stores/auth-store";
import { hasPermission } from "@/lib/permissions";
import { PageHeader } from "@/components/console/Pageheader";
import { ContentTypeManager } from "@/components/console/content/content-types/content-type";

export default function ContentTypesPage() {
  const user = useAuthStore(selectUser);
  const router = useRouter();

  useEffect(() => {
    if (user && !hasPermission(user.role, "edit_settings")) {
      router.push("/console");
    }
  }, [user, router]);

  if (!user || !hasPermission(user.role, "edit_settings")) {
    return null;
  }

  return (
    <div className="container mx-auto md:p-2 p-4">
      <ContentTypeManager />
    </div>
  );
}