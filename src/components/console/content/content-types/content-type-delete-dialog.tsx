"use client";

import { DeleteDialog } from "@/components/ui/delete-dialog";
import { ContentType } from "@/types/content-type";

interface ContentTypeDeleteDialogProps {
  open: boolean;
  contentType: ContentType | null;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ContentTypeDeleteDialog({
  open,
  contentType,
  isPending,
  onConfirm,
  onClose,
}: ContentTypeDeleteDialogProps) {
  if (!contentType) return null;

  return (
    <DeleteDialog
      open={open}
      isPending={isPending}
      title={`Delete "${contentType.name}"?`}
      description={
        <>
          This content type will be permanently deleted. Any content using this
          content type may be affected. This action cannot be undone.
        </>
      }
      confirmText="Delete content type"
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
}