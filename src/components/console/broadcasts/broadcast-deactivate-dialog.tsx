"use client";

import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Broadcast } from "@/types/broadcast";

interface BroadcastDeactivateDialogProps {
  open: boolean;
  broadcast: Broadcast | null;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function BroadcastDeactivateDialog({
  open,
  broadcast,
  isPending,
  onConfirm,
  onClose,
}: BroadcastDeactivateDialogProps) {
  if (!broadcast) return null;

  return (
    <DeleteDialog
      open={open}
      isPending={isPending}
      title={`Deactivate "${broadcast.title}"?`}
      description="It will stop appearing to users immediately, on this page load and via the live push. This cannot be undone."
      confirmText="Deactivate"
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
}
