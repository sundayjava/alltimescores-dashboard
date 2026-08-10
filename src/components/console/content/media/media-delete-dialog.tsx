"use client";

import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Media } from "@/types/media";

interface MediaDeleteDialogProps {
  open: boolean;
  media: Media | null;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function MediaDeleteDialog({
  open,
  media,
  isPending,
  onConfirm,
  onClose,
}: MediaDeleteDialogProps) {
  if (!media) return null;

  return (
    <DeleteDialog
      open={open}
      isPending={isPending}
      title={`Delete "${media.originalName}"?`}
      description="This file will be permanently removed from your media library and cannot be recovered."
      confirmText="Delete media"
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
}