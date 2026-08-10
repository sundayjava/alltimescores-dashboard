"use client";

import { useAuthStore, selectUser } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { hasPermission } from "@/lib/permissions";
import { ContentListPage } from "@/components/console/content/list/content-list-page";

export default function PostPage() {
  const user = useAuthStore(selectUser);
  const router = useRouter();

  useEffect(() => {
    if (user && !hasPermission(user.role, "view_content")) {
      router.push("/console");
    }
  }, [user, router]);

  if (!user || !hasPermission(user.role, "view_content")) return null;

  return <ContentListPage />;
}