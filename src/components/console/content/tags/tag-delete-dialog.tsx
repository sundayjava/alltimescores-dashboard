"use client";

import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Tag } from "@/types/tag";

interface TagDeleteDialogProps {
  open: boolean;
  tag: Tag | null;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function TagDeleteDialog({
  open,
  tag,
  isPending,
  onConfirm,
  onClose,
}: TagDeleteDialogProps) {
  if (!tag) return null;

  const articleCount = tag._count?.contents ?? 0;

  return (
    <DeleteDialog
      open={open}
      isPending={isPending}
      title={`Delete "${tag.name}"?`}
      description={
        articleCount > 0 ? (
          <>
            This tag is attached to{" "}
            <span className="font-medium text-foreground">
              {articleCount}{" "}
              {articleCount === 1 ? "article" : "articles"}
            </span>
            . Deleting it will remove the tag from all of them. This cannot be
            undone.
          </>
        ) : (
          "This tag will be permanently removed. This cannot be undone."
        )
      }
      confirmText="Delete tag"
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
}