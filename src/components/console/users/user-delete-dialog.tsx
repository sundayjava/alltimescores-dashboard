"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminUserListItem } from "@/types/admin-user";
import { cn } from "@/lib/utils";

interface UserDeleteDialogProps {
  open: boolean;
  user: AdminUserListItem | null;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

// Keyed by user.id in the parent so this remounts (and its confirmText
// resets) whenever the delete target changes, instead of needing an effect.
function DeleteConfirmBody({
  user,
  isPending,
  onConfirm,
  onClose,
}: {
  user: AdminUserListItem;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const [confirmText, setConfirmText] = useState("");
  const matches = confirmText.trim().toLowerCase() === user.email.toLowerCase();

  return (
    <>
      <h2 className="text-base font-semibold text-card-foreground">
        Delete {user.firstName} {user.lastName}?
      </h2>

      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        This immediately revokes all their sessions and blocks them from
        ever logging back in — their email stays taken, so they can&apos;t
        re-register either. Their existing content/comments are untouched.
        This cannot be undone.
      </p>

      <div className="mt-4 text-left">
        <label className="text-xs font-medium text-muted-foreground">
          Type <span className="font-mono text-foreground">{user.email}</span> to confirm
        </label>
        <Input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={user.email}
          className="mt-1.5 h-9 text-sm"
          disabled={isPending}
          autoComplete="off"
        />
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isPending}
          className="min-w-20"
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onConfirm}
          disabled={isPending || !matches}
          className="min-w-30"
        >
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Delete user"}
        </Button>
      </div>
    </>
  );
}

export function UserDeleteDialog({
  open,
  user,
  isPending,
  onConfirm,
  onClose,
}: UserDeleteDialogProps) {
  if (!open || !user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={!isPending ? onClose : undefined}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-sm rounded-xl border border-border bg-card shadow-xl",
          "animate-in fade-in-0 zoom-in-95 duration-200"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 h-7 w-7"
          onClick={onClose}
          disabled={isPending}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="px-6 pb-6 pt-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>

          <DeleteConfirmBody
            key={user.id}
            user={user}
            isPending={isPending}
            onConfirm={onConfirm}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}
