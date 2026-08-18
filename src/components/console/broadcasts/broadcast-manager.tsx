"use client";

import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBroadcasts } from "@/hooks/broadcasts/use-broadcasts";
import {
  useCreateBroadcast,
  useDeactivateBroadcast,
  useReactivateBroadcast,
  useDeleteBroadcast,
} from "@/hooks/broadcasts/use-broadcast-mutations";
import { Broadcast, CreateBroadcastRequest } from "@/types/broadcast";
import { CreateBroadcastSchema } from "@/schemas/broadcast.schema";
import { BroadcastTable } from "./broadcast-table";
import { BroadcastDialog } from "./broadcast-dialog";
import { BroadcastDeactivateDialog } from "./broadcast-deactivate-dialog";
import { BroadcastDeleteDialog } from "./broadcast-delete-dialog";
import { PageHeader } from "../Pageheader";

const PAGE_SIZE = 20;

export function BroadcastManager() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState<Broadcast | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Broadcast | null>(null);

  const { data, isLoading, isFetching } = useBroadcasts({ page, limit: PAGE_SIZE });

  const broadcasts = data?.data.broadcasts ?? [];
  const pagination = data?.data.pagination;

  const createMutation = useCreateBroadcast();
  const deactivateMutation = useDeactivateBroadcast();
  const reactivateMutation = useReactivateBroadcast();
  const deleteMutation = useDeleteBroadcast();

  const handleCreate = useCallback(
    async (values: CreateBroadcastSchema) => {
      // Drop empty optional fields rather than sending "" for link/linkLabel.
      const payload: CreateBroadcastRequest = {
        title: values.title,
        message: values.message,
        level: values.level,
        ...(values.link ? { link: values.link } : {}),
        ...(values.linkLabel ? { linkLabel: values.linkLabel } : {}),
      };
      await createMutation.mutateAsync(payload);
      setCreateOpen(false);
    },
    [createMutation]
  );

  const handleDeactivateConfirm = useCallback(async () => {
    if (!deactivateTarget) return;
    await deactivateMutation.mutateAsync(deactivateTarget.id);
    setDeactivateTarget(null);
  }, [deactivateTarget, deactivateMutation]);

  const handleReactivate = useCallback(
    (broadcast: Broadcast) => {
      reactivateMutation.mutate(broadcast.id);
    },
    [reactivateMutation]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  }, [deleteTarget, deleteMutation]);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <PageHeader
          title="Broadcasts"
          description="Push real-time announcements to everyone connected right now."
        />
        <Button size="icon-sm" onClick={() => setCreateOpen(true)} className="cursor-pointer">
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <BroadcastTable
        broadcasts={broadcasts}
        total={pagination?.total ?? 0}
        page={pagination?.page ?? 1}
        limit={PAGE_SIZE}
        totalPages={pagination?.totalPages ?? 1}
        isLoading={isLoading}
        isFetching={isFetching}
        onPageChange={setPage}
        onDeactivate={(broadcast) => setDeactivateTarget(broadcast)}
        onReactivate={handleReactivate}
        onDelete={(broadcast) => setDeleteTarget(broadcast)}
      />

      <BroadcastDialog
        open={createOpen}
        isPending={createMutation.isPending}
        onSubmit={handleCreate}
        onClose={() => setCreateOpen(false)}
      />

      <BroadcastDeactivateDialog
        open={!!deactivateTarget}
        broadcast={deactivateTarget}
        isPending={deactivateMutation.isPending}
        onConfirm={handleDeactivateConfirm}
        onClose={() => setDeactivateTarget(null)}
      />

      <BroadcastDeleteDialog
        open={!!deleteTarget}
        broadcast={deleteTarget}
        isPending={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
