"use client";

import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Broadcast } from "@/types/broadcast";

interface BroadcastDeleteDialogProps {
  open: boolean;
  broadcast: Broadcast | null;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function BroadcastDeleteDialog({
  open,
  broadcast,
  isPending,
  onConfirm,
  onClose,
}: BroadcastDeleteDialogProps) {
  if (!broadcast) return null;

  return (
    <DeleteDialog
      open={open}
      isPending={isPending}
      title={`Delete "${broadcast.title}"?`}
      description="This permanently removes the broadcast from the record. This cannot be undone."
      confirmText="Delete broadcast"
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
}
