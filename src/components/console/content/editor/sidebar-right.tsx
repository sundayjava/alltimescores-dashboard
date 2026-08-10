"use client";

import { useState } from "react";
import {
    Control,
    UseFormRegister,
} from "react-hook-form";
import { ChevronDown, ChevronRight, Settings2, X } from "lucide-react";
import { ContentSchema } from "@/schemas/content.schema";
import { CategoryStub, ContentTypeStub, MediaItem, TagStub, UserStub } from "@/types/content";
import { PanelCategory } from "./panels/panel-category";
import { PanelTags } from "./panels/panel-tags";
import { PanelCoverImage } from "./panels/panel-cover-image";
import { PanelSettings } from "./panels/panel-settings";
import { PanelSeo } from "./panels/panel-seo";
import { cn } from "@/lib/utils";

interface SidebarRightProps {
    control: Control<ContentSchema>;
    register: UseFormRegister<ContentSchema>;
    errors: Record<string, { message?: string }>;
    categories: CategoryStub[];
    contentTypes: ContentTypeStub[];
    availableTags: TagStub[];
    authors: UserStub[];
    coverImage: MediaItem | null;
    onCoverImageChange: (media: MediaItem | null) => void;
}

function Panel({
    title,
    children,
    defaultOpen = true,
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-border last:border-0">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold hover:bg-muted/30 transition-colors"
            >
                {title}
                {open ? (
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                )}
            </button>
            <div
                className={cn(
                    "px-4 pb-4 space-y-3 overflow-hidden transition-all",
                    open ? "block" : "hidden"
                )}
            >
                {children}
            </div>
        </div>
    );
}

export function SidebarRight({
    control,
    register,
    errors,
    categories,
    contentTypes,
    availableTags,
    authors,
    coverImage,
    onCoverImageChange,
}: SidebarRightProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Mobile toggle */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 border border-border bg-card px-3 py-2 text-sm font-medium text-foreground lg:hidden"
            >
                <Settings2 className="h-4 w-4" />
                Details
            </button>

            {/* Mobile backdrop */}
            {open && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={cn(
                    "fixed top-14 bottom-0 right-0 z-40 w-72 max-w-[85vw] shrink-0 border-l border-border bg-card overflow-y-auto transition-transform duration-200 ease-in-out",
                    "lg:static lg:top-auto lg:bottom-auto lg:z-auto lg:translate-x-0",
                    open ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex items-center justify-between px-4 pt-4 lg:hidden">
                    <p className="text-sm font-semibold">Post details</p>
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                        aria-label="Close details panel"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <Panel title="Category & Type" defaultOpen>
                    <PanelCategory
                        control={control}
                        categories={categories}
                        contentTypes={contentTypes}
                        errors={errors as Parameters<typeof PanelCategory>[0]["errors"]}
                    />
                </Panel>

                <Panel title="Cover Image" defaultOpen>
                    <PanelCoverImage
                        control={control}
                        currentImage={coverImage}
                        onImageChange={onCoverImageChange}
                    />
                </Panel>

                <Panel title="Tags" defaultOpen>
                    <PanelTags control={control} availableTags={availableTags} />
                </Panel>

                <Panel title="Settings" defaultOpen>
                    <PanelSettings
                        control={control}
                        register={register}
                        authors={authors}
                    />
                </Panel>

                <Panel title="SEO" defaultOpen={false}>
                    <PanelSeo control={control} register={register} />
                </Panel>
            </aside>
        </>
    );
}