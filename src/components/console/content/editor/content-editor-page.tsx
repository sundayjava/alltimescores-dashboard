"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { contentSchema, ContentSchema } from "@/schemas/content.schema";
import { Content, MediaItem } from "@/types/content";
import { useContent, useContentTypes } from "@/hooks/content/use-contents";
import { useAllCategories } from "@/hooks/categories/use-categories";
import { useTags } from "@/hooks/tags/use-tags";
import {
    useCreateContent,
    useUpdateContent,
    usePublishContent,
    useUnpublishContent,
    useArchiveContent,
    useRestoreDraft,
    useScheduleContent,
} from "@/hooks/content/use-content-mutations";
import { useAuthStore, selectUser } from "@/stores/auth-store";
import { EditorHeader } from "./editor-header";
import { EditorBody } from "./editor-body";
import { SidebarRight } from "./sidebar-right";
import { Loader2 } from "lucide-react";

interface ContentEditorPageProps {
    contentId?: string; // undefined = new content
}

export function ContentEditorPage({ contentId }: ContentEditorPageProps) {
    const router = useRouter();
    const user = useAuthStore(selectUser);
    const isEditing = !!contentId;

    // ── Fetch existing content for edit mode ─────────────────────────────────
    const { data: existingContent, isLoading: isLoadingContent } = useContent(
        contentId ?? ""
    );

    // ── Fetch supporting data ─────────────────────────────────────────────────
    const { data: categoriesData } = useAllCategories();
    const { data: contentTypesData } = useContentTypes();
    const { data: tagsData } = useTags({ limit: 100 });

    const categories = categoriesData?.data ?? [];
    const contentTypes = contentTypesData?.data ?? [];
    const availableTags = (tagsData?.data ?? []).map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
    }));

    // ── Cover image local state ───────────────────────────────────────────────
    const [coverImage, setCoverImage] = useState<MediaItem | null>(
        existingContent?.coverImage ?? null
    );

    // ── Schedule dialog ───────────────────────────────────────────────────────
    const [scheduleOpen, setScheduleOpen] = useState(false);

    // ── Form ─────────────────────────────────────────────────────────────────
    const {
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isDirty },
    } = useForm<ContentSchema>({
        resolver: zodResolver(contentSchema),
        defaultValues: {
            title: "",
            excerpt: "",
            content: "",
            categoryId: "",
            contentTypeId: "",
            authorId: user?.id ?? "",
            coverImageId: "",
            tagIds: [],
            visibility: "PUBLIC",
            allowComments: true,
            isFeatured: false,
            isBreaking: false,
            isPinned: false,
            seo: {
                seoTitle: "",
                metaDescription: "",
                focusKeyword: "",
                canonicalUrl: "",
                ogTitle: "",
                ogDescription: "",
                twitterTitle: "",
                twitterDescription: "",
                noIndex: false,
                noFollow: false,
            },
        },
    });

    // Populate form once existing content loads
    useEffect(() => {
        if (!existingContent) return;
        reset({
            title: existingContent.title,
            excerpt: existingContent.excerpt ?? "",
            content: existingContent.content,
            categoryId: existingContent.categoryId,
            contentTypeId: existingContent.contentTypeId,
            authorId: existingContent.authorId,
            coverImageId: existingContent.coverImageId ?? "",
            tagIds: (existingContent.tags ?? []).map((t) => t.tag.id),
            visibility: existingContent.visibility,
            allowComments: existingContent.allowComments,
            isFeatured: existingContent.isFeatured,
            isBreaking: existingContent.isBreaking,
            isPinned: existingContent.isPinned,
            seo: {
                seoTitle: existingContent.seoMetadata?.seoTitle ?? "",
                metaDescription: existingContent.seoMetadata?.metaDescription ?? "",
                focusKeyword: existingContent.seoMetadata?.focusKeyword ?? "",
                canonicalUrl: existingContent.seoMetadata?.canonicalUrl ?? "",
                ogTitle: existingContent.seoMetadata?.ogTitle ?? "",
                ogDescription: existingContent.seoMetadata?.ogDescription ?? "",
                twitterTitle: existingContent.seoMetadata?.twitterTitle ?? "",
                twitterDescription: existingContent.seoMetadata?.twitterDescription ?? "",
                noIndex: existingContent.seoMetadata?.noIndex ?? false,
                noFollow: existingContent.seoMetadata?.noFollow ?? false,
            },
        });
        if (existingContent.coverImage) {
            setCoverImage(existingContent.coverImage);
        }
    }, [existingContent, reset]);

    // ── Mutations ─────────────────────────────────────────────────────────────
    const createMutation = useCreateContent();
    const updateMutation = useUpdateContent();
    const publishMutation = usePublishContent();
    const unpublishMutation = useUnpublishContent();
    const archiveMutation = useArchiveContent();
    const restoreMutation = useRestoreDraft();
    const scheduleMutation = useScheduleContent();

    // ── Handlers ──────────────────────────────────────────────────────────────
    const cleanPayload = (values: ContentSchema) => ({
        ...values,
        excerpt: values.excerpt || undefined,
        coverImageId: values.coverImageId || undefined,
        seo: values.seo
            ? Object.fromEntries(
                Object.entries(values.seo).filter(([, v]) => v !== "" && v !== undefined)
            )
            : undefined,
    });

    const handleSave = handleSubmit(async (values) => {
        const payload = cleanPayload(values);
        if (isEditing && contentId) {
            await updateMutation.mutateAsync({ id: contentId, payload });
        } else {
            const created = await createMutation.mutateAsync(
                payload as Parameters<typeof createMutation.mutateAsync>[0]
            );
            router.replace(`/editor/${created.id}/edit`);
        }
    });

    const handlePublish = useCallback(async () => {
        if (!contentId) {
            toast.error("Save the content first before publishing.");
            return;
        }
        await publishMutation.mutateAsync(contentId);
    }, [contentId, publishMutation]);

    const handleUnpublish = useCallback(async () => {
        if (!contentId) return;
        await unpublishMutation.mutateAsync(contentId);
    }, [contentId, unpublishMutation]);

    const handleArchive = useCallback(async () => {
        if (!contentId) return;
        await archiveMutation.mutateAsync(contentId);
    }, [contentId, archiveMutation]);

    const handleRestoreDraft = useCallback(async () => {
        if (!contentId) return;
        await restoreMutation.mutateAsync(contentId);
    }, [contentId, restoreMutation]);

    const handleSchedule = useCallback(() => {
        if (!contentId) {
            toast.error("Save the content first before scheduling.");
            return;
        }
        const scheduledAt = window.prompt(
            "Enter scheduled publish date (YYYY-MM-DD HH:mm):"
        );
        if (scheduledAt) {
            scheduleMutation.mutate({ id: contentId, scheduledAt });
        }
    }, [contentId, scheduleMutation]);

    // ── Loading state ─────────────────────────────────────────────────────────
    if (isEditing && isLoadingContent) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const isSaving = createMutation.isPending || updateMutation.isPending;
    const isPublishing =
        publishMutation.isPending || unpublishMutation.isPending;

    // Build authors list — for now just the current user
    // In a real scenario you'd fetch users from an API
    const authors: Array<{ id: string; firstName: string; lastName: string }> =
        user
            ? [{ id: user.id, firstName: user.firstName, lastName: user.lastName }]
            : [];

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Top bar */}
            <EditorHeader
                content={isEditing ? (existingContent as Content) : null}
                isSaving={isSaving}
                isPublishing={isPublishing}
                isDirty={isDirty}
                onSave={handleSave}
                onPublish={handlePublish}
                onUnpublish={handleUnpublish}
                onArchive={handleArchive}
                onRestoreDraft={handleRestoreDraft}
                onSchedule={handleSchedule}
            />

            {/* Editor layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Main writing area */}
                <main className="flex-1 overflow-hidden bg-background flex">
                    <EditorBody
                        register={register}
                        setValue={setValue}
                        control={control}
                        errors={errors as Parameters<typeof EditorBody>[0]["errors"]}
                    />
                </main>

                {/* Right sidebar */}
                <SidebarRight
                    control={control}
                    register={register}
                    errors={errors as Record<string, { message?: string }>}
                    categories={categories}
                    contentTypes={contentTypes}
                    availableTags={availableTags}
                    authors={authors}
                    coverImage={coverImage}
                    onCoverImageChange={setCoverImage}
                />
            </div>
        </div>
    );
}