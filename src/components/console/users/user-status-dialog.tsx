"use client";

import { DeleteDialog } from "@/components/ui/delete-dialog";
import { AdminUserListItem } from "@/types/admin-user";

interface UserStatusDialogProps {
  open: boolean;
  user: AdminUserListItem | null;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function UserStatusDialog({
  open,
  user,
  isPending,
  onConfirm,
  onClose,
}: UserStatusDialogProps) {
  if (!user) return null;

  return (
    <DeleteDialog
      open={open}
      isPending={isPending}
      title={`Deactivate ${user.firstName} ${user.lastName}?`}
      description={
        <>
          This will immediately sign them out everywhere and block them from
          logging back in until reactivated.
        </>
      }
      confirmText="Deactivate"
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
}
