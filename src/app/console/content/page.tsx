"use client";

import { useAuthStore, selectUser } from "@/stores/auth-store";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import { hasPermission } from "@/lib/permissions";
import { ContentListPage } from "@/components/console/content/list/content-list-page";

export default function ContentPage() {
  redirect("/console/content/posts");
}