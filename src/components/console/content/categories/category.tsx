"use client";

import { useState, useCallback, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategories, useAllCategories } from "@/hooks/categories/use-categories";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/categories/use-category-mutations";
import { Category } from "@/types/category";
import { CreateCategorySchema, UpdateCategorySchema } from "@/schemas/category.schema";
import { SortState, SortField } from "./category-columns";
import { CategoryTable } from "./category-table";
import { CategoryDialog } from "./category-dialog";
import { CategoryDeleteDialog } from "./category-delete-dialog";
import { PageHeader } from "../../Pageheader";

type ActiveFilter = "all" | "active" | "inactive";

const PAGE_SIZE = 10;

export function CategoryManager() {
  // ── Query state ──────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [sort, setSort] = useState<SortState>({ field: null, direction: "asc" });

  // ── Dialog state ─────────────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  // ── Data ─────────────────────────────────────────────────────────────────
  const queryParams = {
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    isActive:
      activeFilter === "active"
        ? true
        : activeFilter === "inactive"
          ? false
          : undefined,
  };

  const { data, isLoading, isFetching } = useCategories(queryParams);

  // For parent selector in forms — flat list of all categories
  const { data: allData } = useAllCategories();
  const allCategories = allData?.data ?? [];

  const categories = data?.data ?? [];
  const pagination = data?.pagination;

  // Client-side sort on current page
  const sortedCategories = useMemo(() => {
    if (!sort.field) return categories;
    return [...categories].sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      if (sort.field === "name") {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      } else if (sort.field === "contents") {
        aVal = a._count?.contents ?? 0;
        bVal = b._count?.contents ?? 0;
      } else if (sort.field === "sortOrder") {
        aVal = a.sortOrder ?? 0;
        bVal = b.sortOrder ?? 0;
      } else {
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
      }

      if (aVal < bVal) return sort.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [categories, sort]);

  // ── Mutations ────────────────────────────────────────────────────────────
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleFilterChange = useCallback((filter: ActiveFilter) => {
    setActiveFilter(filter);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((field: SortField) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleCreate = useCallback(
    async (values: CreateCategorySchema | UpdateCategorySchema) => {
      // Clean empty strings to undefined before sending
      const payload = Object.fromEntries(
        Object.entries(values).filter(([, v]) => v !== "" && v !== undefined)
      );
      await createMutation.mutateAsync(payload as CreateCategorySchema);
      setCreateOpen(false);
    },
    [createMutation]
  );

  const handleUpdate = useCallback(
    async (values: CreateCategorySchema | UpdateCategorySchema) => {
      if (!editCategory) return;
      const payload = Object.fromEntries(
        Object.entries(values).filter(([, v]) => v !== "" && v !== undefined)
      );
      await updateMutation.mutateAsync({
        id: editCategory.id,
        payload: payload as UpdateCategorySchema,
      });
      setEditCategory(null);
    },
    [editCategory, updateMutation]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteCategory) return;
    await deleteMutation.mutateAsync(deleteCategory.id);
    setDeleteCategory(null);
  }, [deleteCategory, deleteMutation]);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <PageHeader
          title="Categories"
          description="Manage and organise your content categories."
        />
        <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5 cursor-pointer">
          <div className="flex items-center justify-center">
            <Plus className="h-3.5 w-3.5 dark:text-black text-white" />
          </div>
        </Button>
      </div>

      <CategoryTable
        categories={sortedCategories}
        total={pagination?.total ?? 0}
        page={pagination?.page ?? 1}
        limit={PAGE_SIZE}
        totalPages={pagination?.totalPages ?? 1}
        isLoading={isLoading}
        isFetching={isFetching}
        search={search}
        sort={sort}
        activeFilter={activeFilter}
        onSearchChange={handleSearchChange}
        onPageChange={setPage}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        onEdit={(cat) => setEditCategory(cat)}
        onDelete={(cat) => setDeleteCategory(cat)}
      />

      <CategoryDialog
        open={createOpen}
        category={null}
        allCategories={allCategories}
        isPending={createMutation.isPending}
        onSubmit={handleCreate}
        onClose={() => setCreateOpen(false)}
      />

      <CategoryDialog
        open={!!editCategory}
        category={editCategory}
        allCategories={allCategories}
        isPending={updateMutation.isPending}
        onSubmit={handleUpdate}
        onClose={() => setEditCategory(null)}
      />

      <CategoryDeleteDialog
        open={!!deleteCategory}
        category={deleteCategory}
        isPending={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteCategory(null)}
      />
    </>
  );
}