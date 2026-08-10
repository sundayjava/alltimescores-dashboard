"use client";

import { useState, useCallback, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore, selectUser } from "@/stores/auth-store";
import { hasPermission } from "@/lib/permissions";
import { useTags } from "@/hooks/tags/use-tags";
import {
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
} from "@/hooks/tags/use-tag-mutations";
import { Tag } from "@/types/tag";
import { CreateTagSchema, UpdateTagSchema } from "@/schemas/tag.schema";
import { SortState, SortField } from "./tag-columns";
import { TagTable } from "./tag-table";
import { TagDialog } from "./tag-dialog";
import { TagDeleteDialog } from "./tag-delete-dialog";
import { PageHeader } from "../../Pageheader";

const PAGE_SIZE = 10;

export function TagManager() {
  const user = useAuthStore(selectUser);
  const canDelete = user ? hasPermission(user.role, "delete_content") : false;

  // ── Query state ──────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState>({ field: null, direction: "asc" });

  // ── Dialog state ─────────────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);
  const [editTag, setEditTag] = useState<Tag | null>(null);
  const [deleteTag, setDeleteTag] = useState<Tag | null>(null);

  // ── Data ─────────────────────────────────────────────────────────────────
  const { data, isLoading, isFetching } = useTags({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
  });

  const tags = data?.data ?? [];
  const pagination = data?.pagination;

  // Client-side sort (server handles pagination/search; sort is applied on the current page)
  const sortedTags = useMemo(() => {
    if (!sort.field) return tags;

    return [...tags].sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      if (sort.field === "name") {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      } else if (sort.field === "articles") {
        aVal = a._count?.contents ?? 0;
        bVal = b._count?.contents ?? 0;
      } else {
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
      }

      if (aVal < bVal) return sort.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [tags, sort]);

  // ── Mutations ────────────────────────────────────────────────────────────
  const createMutation = useCreateTag();
  const updateMutation = useUpdateTag();
  const deleteMutation = useDeleteTag();

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1); // reset to page 1 on new search
  }, []);

  const handleSortChange = useCallback((field: SortField) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleCreate = useCallback(
    async (values: CreateTagSchema | UpdateTagSchema) => {
      await createMutation.mutateAsync(values as CreateTagSchema);
      setCreateOpen(false);
    },
    [createMutation]
  );

  const handleUpdate = useCallback(
    async (values: CreateTagSchema | UpdateTagSchema) => {
      if (!editTag) return;
      await updateMutation.mutateAsync({
        id: editTag.id,
        payload: values as UpdateTagSchema,
      });
      setEditTag(null);
    },
    [editTag, updateMutation]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTag) return;
    await deleteMutation.mutateAsync(deleteTag.id);
    setDeleteTag(null);
  }, [deleteTag, deleteMutation]);

  return (
    <>
      {/* Create button — exposed so the page can also place it in the header */}
      <div className="flex justify-between items-center mb-8">
        <PageHeader
          title="Tags"
          description="Create and organise content tags."
        />
        <Button
          size="sm"
          onClick={() => setCreateOpen(true)}
          className="gap-1.5 cursor-pointer text-secondary hover:text-secondary/70"
        >
          <div className="flex items-center justify-center">
            <Plus className="h-3.5 w-3.5 text-black" />
          </div>
        </Button>
      </div>

      {/* Table */}
      <TagTable
        tags={sortedTags}
        total={pagination?.total ?? 0}
        page={pagination?.page ?? 1}
        limit={PAGE_SIZE}
        totalPages={pagination?.totalPages ?? 1}
        isLoading={isLoading}
        isFetching={isFetching}
        search={search}
        sort={sort}
        canDelete={canDelete}
        onSearchChange={handleSearchChange}
        onPageChange={setPage}
        onSortChange={handleSortChange}
        onEdit={(tag) => setEditTag(tag)}
        onDelete={(tag) => setDeleteTag(tag)}
      />

      {/* Create dialog */}
      <TagDialog
        open={createOpen}
        tag={null}
        isPending={createMutation.isPending}
        onSubmit={handleCreate}
        onClose={() => setCreateOpen(false)}
      />

      {/* Edit dialog */}
      <TagDialog
        open={!!editTag}
        tag={editTag}
        isPending={updateMutation.isPending}
        onSubmit={handleUpdate}
        onClose={() => setEditTag(null)}
      />

      {/* Delete dialog */}
      <TagDeleteDialog
        open={!!deleteTag}
        tag={deleteTag}
        isPending={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTag(null)}
      />
    </>
  );
}