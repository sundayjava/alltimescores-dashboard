"use client";

import { useState, useCallback, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore, selectUser } from "@/stores/auth-store";
import { hasPermission } from "@/lib/permissions";
import { useContentTypes } from "@/hooks/content-types/use-content-types";
import {
  useCreateContentType,
  useUpdateContentType,
  useDeleteContentType,
} from "@/hooks/content-types/use-content-type-mutations";
import { ContentType } from "@/types/content-type";
import {
  CreateContentTypeSchema,
  UpdateContentTypeSchema,
} from "@/schemas/content-type.schema";
import { SortState, SortField } from "./content-type-columns";
import { ContentTypeTable } from "./content-type-table";
import { ContentTypeDeleteDialog } from "./content-type-delete-dialog";
import { ContentTypeDialog } from "./content-type-dialog";
import { PageHeader } from "../../Pageheader";

const PAGE_SIZE = 10;

export function ContentTypeManager() {
  const user = useAuthStore(selectUser);
  const canDelete = user ? hasPermission(user.role, "edit_settings") : false;

  // ── Query state ───────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState>({ field: null, direction: "asc" });
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(undefined);

  // ── Dialog state ──────────────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);
  const [editContentType, setEditContentType] = useState<ContentType | null>(null);
  const [deleteContentType, setDeleteContentType] = useState<ContentType | null>(null);

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data, isLoading, isFetching } = useContentTypes({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    isActive: isActiveFilter, // Also sent to backend (if supported)
  });

  const contentTypes = data?.data ?? [];
  const pagination = data?.pagination;

  // Client-side filter and sort
  const sortedContentTypes = useMemo(() => {
    let filtered = contentTypes;

    // Apply isActive filter if set
    if (isActiveFilter !== undefined) {
      filtered = contentTypes.filter((ct) => ct.isActive === isActiveFilter);
    }

    // Apply sorting if field is set
    if (!sort.field) return filtered;

    return [...filtered].sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      if (sort.field === "name") {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      } else if (sort.field === "sortOrder") {
        aVal = a.sortOrder ?? Infinity;
        bVal = b.sortOrder ?? Infinity;
      } else {
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
      }

      if (aVal < bVal) return sort.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [contentTypes, sort, isActiveFilter]);

  // ── Mutations ─────────────────────────────────────────────────────────────
  const createMutation = useCreateContentType();
  const updateMutation = useUpdateContentType();
  const deleteMutation = useDeleteContentType();

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((field: SortField) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleIsActiveFilterChange = useCallback((value: boolean | undefined) => {
    setIsActiveFilter(value);
    setPage(1);
  }, []);

  const handleCreate = useCallback(
    async (values: CreateContentTypeSchema | UpdateContentTypeSchema) => {
      await createMutation.mutateAsync(values as CreateContentTypeSchema);
      setCreateOpen(false);
    },
    [createMutation]
  );

  const handleUpdate = useCallback(
    async (values: CreateContentTypeSchema | UpdateContentTypeSchema) => {
      if (!editContentType) return;
      await updateMutation.mutateAsync({
        id: editContentType.id,
        payload: values as UpdateContentTypeSchema,
      });
      setEditContentType(null);
    },
    [editContentType, updateMutation]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteContentType) return;
    await deleteMutation.mutateAsync(deleteContentType.id);
    setDeleteContentType(null);
  }, [deleteContentType, deleteMutation]);

  return (
    <>
      <div className="flex justify-between items-center mb-10">
        <PageHeader
          title="Content Types"
          description="Manage the content types available across your CMS."
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

      <ContentTypeTable
        contentTypes={sortedContentTypes}
        total={sortedContentTypes.length}
        page={pagination?.page ?? 1}
        limit={PAGE_SIZE}
        totalPages={Math.ceil(sortedContentTypes.length / PAGE_SIZE)}
        isLoading={isLoading}
        isFetching={isFetching}
        search={search}
        sort={sort}
        isActiveFilter={isActiveFilter}
        canDelete={canDelete}
        onSearchChange={handleSearchChange}
        onPageChange={setPage}
        onSortChange={handleSortChange}
        onIsActiveFilterChange={handleIsActiveFilterChange}
        onEdit={(ct) => setEditContentType(ct)}
        onDelete={(ct) => setDeleteContentType(ct)}
      />

      <ContentTypeDialog
        open={createOpen}
        contentType={null}
        isPending={createMutation.isPending}
        onSubmit={handleCreate}
        onClose={() => setCreateOpen(false)}
      />

      <ContentTypeDialog
        open={!!editContentType}
        contentType={editContentType}
        isPending={updateMutation.isPending}
        onSubmit={handleUpdate}
        onClose={() => setEditContentType(null)}
      />

      <ContentTypeDeleteDialog
        open={!!deleteContentType}
        contentType={deleteContentType}
        isPending={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteContentType(null)}
      />
    </>
  );
}