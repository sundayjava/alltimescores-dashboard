"use client";

import { use } from "react";
import { useAuthStore, selectUser } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { hasPermission } from "@/lib/permissions";
import { ContentEditorPage } from "@/components/console/content/editor/content-editor-page";

interface EditContentPageProps {
    params: Promise<{ id: string }>;
}

export default function EditContentPage({ params }: EditContentPageProps) {
    const { id } = use(params);
    const user = useAuthStore(selectUser);
    const router = useRouter();

    useEffect(() => {
        if (user && !hasPermission(user.role, "edit_content")) {
            router.push("/console/content");
        }
    }, [user, router]);

    if (!user || !hasPermission(user.role, "edit_content")) return null;

    return <ContentEditorPage contentId={id} />;
}
