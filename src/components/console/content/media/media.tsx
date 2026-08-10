"use client";

import { useState, useCallback } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore, selectUser } from "@/stores/auth-store";
import { hasPermission } from "@/lib/permissions";
import { useMedia } from "@/hooks/media/use-media";
import { useUploadMedia, useDeleteMedia } from "@/hooks/media/use-media-mutations";
import { Media, MediaFolder } from "@/types/media";
import { MediaGrid } from "./media-grid";
import { MediaUploadDialog } from "./media-upload-dialog";
import { MediaDeleteDialog } from "./media-delete-dialog";
import { PAGE_SIZE } from "@/lib/constant";
import { PageHeader } from "../../Pageheader";

export function MediaManager() {
  const user = useAuthStore(selectUser);
  const canDelete = user ? hasPermission(user.role, "delete_content") : false;
  const canUpload = user
    ? hasPermission(user.role, "create_content")
    : false;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);
  const [pendingDelete, setPendingDelete] = useState<Media | null>(null);

  const { data, isLoading, isFetching } = useMedia({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
  });

  const mediaItems = data?.data ?? [];
  const pagination = data?.pagination;

  const uploadMutation = useUploadMedia();
  const deleteMutation = useDeleteMedia();

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleUpload = useCallback(
    async (file: File, folder: MediaFolder) => {
      await uploadMutation.mutateAsync({ file, folder });
      setUploadKey((k) => k + 1);
      setUploadOpen(false);
    },
    [uploadMutation]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!pendingDelete) return;
    await deleteMutation.mutateAsync(pendingDelete.id);
    setPendingDelete(null);
  }, [pendingDelete, deleteMutation]);

  return (
    <>
      {/* Upload button — mirrors other pages */}
      {canUpload && (
        <div className="flex justify-between items-center mb-10">
          <PageHeader
            title="Media"
            description="Upload and manage your media library."
          />
          <Button
            size="sm"
            onClick={() => setUploadOpen(true)}
            className="gap-1.5 cursor-pointer text-secondary hover:text-secondary/70"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload
          </Button>
        </div>
      )}

      {/* Full-width grid */}
      <MediaGrid
        media={mediaItems}
        total={pagination?.total ?? 0}
        page={pagination?.page ?? 1}
        limit={PAGE_SIZE}
        totalPages={pagination?.totalPages ?? 1}
        isLoading={isLoading}
        isFetching={isFetching}
        search={search}
        canDelete={canDelete}
        onSearchChange={handleSearchChange}
        onPageChange={setPage}
        onDelete={(media) => setPendingDelete(media)}
      />

      {/* Upload dialog */}
      <MediaUploadDialog
        key={uploadKey}
        open={uploadOpen}
        isPending={uploadMutation.isPending}
        progress={uploadMutation.progress}
        onUpload={handleUpload}
        onClose={() => !uploadMutation.isPending && setUploadOpen(false)}
      />

      {/* Delete dialog */}
      <MediaDeleteDialog
        open={!!pendingDelete}
        media={pendingDelete}
        isPending={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setPendingDelete(null)}
      />
    </>
  );
}