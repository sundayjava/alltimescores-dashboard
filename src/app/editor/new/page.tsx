"use client";

import { useAuthStore, selectUser } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { hasPermission } from "@/lib/permissions";
import { ContentEditorPage } from "@/components/console/content/editor/content-editor-page";

export default function NewContentPage() {
    const user = useAuthStore(selectUser);
    const router = useRouter();

    useEffect(() => {
        if (user && !hasPermission(user.role, "create_content")) {
            router.push("/console/content");
        }
    }, [user, router]);

    if (!user || !hasPermission(user.role, "create_content")) return null;

    return <ContentEditorPage />;
}
