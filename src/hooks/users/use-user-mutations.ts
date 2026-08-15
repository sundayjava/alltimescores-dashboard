import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  updateUserRole,
  updateUserPlan,
  updateUserStatus,
  deleteAdminUser,
} from "@/services/admin-user.service";
import { UserRole, UserPlan } from "@/types/auth";
import { USER_KEYS } from "./use-users";
import { getApiErrorMessage } from "@/lib/error-handler";

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      updateUserRole(id, { role }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
      toast.success(`${response.data.firstName}'s role updated to ${response.data.role}.`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update role."));
    },
  });
}

export function useUpdateUserPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, plan }: { id: string; plan: UserPlan }) =>
      updateUserPlan(id, { plan }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
      toast.success(`${response.data.firstName}'s plan updated to ${response.data.plan}.`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update plan."));
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateUserStatus(id, { isActive }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
      toast.success(
        response.data.isActive
          ? `${response.data.firstName} reactivated.`
          : `${response.data.firstName} deactivated and signed out everywhere.`
      );
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update status."));
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdminUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
      toast.success("User deleted.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to delete user."));
    },
  });
}
