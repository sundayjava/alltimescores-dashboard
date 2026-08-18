"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/types/auth";
import { cn } from "@/lib/utils";

interface DeleteAccountDialogProps {
  open: boolean;
  user: User;
  isPending: boolean;
  errorMessage?: string | null;
  onConfirm: (password?: string) => void;
  onClose: () => void;
}

export function DeleteAccountDialog({
  open,
  user,
  isPending,
  errorMessage,
  onConfirm,
  onClose,
}: DeleteAccountDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");
  const matches = confirmText.trim().toLowerCase() === user.email.toLowerCase();

  if (!open) return null;

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

          <h2 className="text-base font-semibold text-card-foreground">
            Delete your account?
          </h2>

          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            This immediately revokes all your sessions and blocks you from
            ever logging back in — your email stays taken, so you
            can&apos;t re-register either. This cannot be undone.
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

          <div className="mt-3 text-left">
            <label className="text-xs font-medium text-muted-foreground">
              Password <span className="text-muted-foreground/70">(only if your account has one)</span>
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank for Google sign-in"
              className="mt-1.5 h-9 text-sm"
              disabled={isPending}
              autoComplete="current-password"
            />
          </div>

          {errorMessage && (
            <p className="mt-3 text-left text-xs text-destructive">{errorMessage}</p>
          )}

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
              onClick={() => onConfirm(password.trim() || undefined)}
              disabled={isPending || !matches}
              className="min-w-30"
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Delete account"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
