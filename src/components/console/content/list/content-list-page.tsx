"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/console/Pageheader";
import { useContents } from "@/hooks/content/use-contents";
import {
    useDeleteContent,
    usePublishContent,
    useUnpublishContent,
    useArchiveContent,
    useRestoreDraft,
} from "@/hooks/content/use-content-mutations";
import { Content, ContentStatus } from "@/types/content";
import { ContentTable } from "./content-table";
import { ContentDeleteDialog } from "./content-delete-dialog";
import { PAGE_SIZE } from "@/lib/constant";

export function ContentListPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<ContentStatus | "ALL">("ALL");
    const [deleteTarget, setDeleteTarget] = useState<Content | null>(null);

    const { data, isLoading, isFetching } = useContents({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
    });

    const contents = data?.data ?? [];
    const pagination = data?.pagination;

    const deleteMutation = useDeleteContent();
    const publishMutation = usePublishContent();
    const unpublishMutation = useUnpublishContent();
    const archiveMutation = useArchiveContent();
    const restoreMutation = useRestoreDraft();

    const handleSearchChange = useCallback((value: string) => {
        setSearch(value);
        setPage(1);
    }, []);

    const handleStatusChange = useCallback((status: ContentStatus | "ALL") => {
        setStatusFilter(status);
        setPage(1);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (!deleteTarget) return;
        await deleteMutation.mutateAsync(deleteTarget.id);
        setDeleteTarget(null);
    }, [deleteTarget, deleteMutation]);

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-6">
            {/* Page header */}
            <div className="flex items-start justify-between gap-4">
                <PageHeader
                    title="Content"
                    description="Manage all your articles, news, and stories."
                />
                <Button size="sm" className="gap-1.5 shrink-0"
                    render={() => (
                        <Link href="/editor/new">
                            <div className="flex items-center justify-center h-6 w-6 bg-accent">
                                <Plus className="h-3.5 w-3.5 text-black" />
                            </div>
                        </Link>
                    )} />
            </div> 

            {/* Table */}
            <ContentTable
                contents={contents}
                total={pagination?.total ?? 0}
                page={pagination?.page ?? 1}
                limit={PAGE_SIZE}
                totalPages={pagination?.totalPages ?? 1}
                isLoading={isLoading}
                isFetching={isFetching}
                search={search}
                statusFilter={statusFilter}
                onSearchChange={handleSearchChange}
                onPageChange={setPage}
                onStatusFilterChange={handleStatusChange}
                onDelete={setDeleteTarget}
                onPublish={(id) => publishMutation.mutate(id)}
                onUnpublish={(id) => unpublishMutation.mutate(id)}
                onArchive={(id) => archiveMutation.mutate(id)}
                onRestore={(id) => restoreMutation.mutate(id)}
            />

            {/* Delete confirm dialog */}
            <ContentDeleteDialog
                open={!!deleteTarget}
                content={deleteTarget}
                isPending={deleteMutation.isPending}
                onConfirm={handleDeleteConfirm}
                onClose={() => setDeleteTarget(null)}
            />
        </div>
    );
}