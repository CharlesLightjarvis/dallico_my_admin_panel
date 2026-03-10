import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../config/query-keys";
import { groupService } from "../services/group-service";
import type { CreateGroupPayload, UpdateGroupPayload } from "types/group";

export function useGroups() {
  return useQuery({
    queryKey: queryKeys.groups.lists(),
    queryFn: () => groupService.getGroups(),
  });
}

export function useGroup(id: string) {
  return useQuery({
    queryKey: queryKeys.groups.detail(id),
    queryFn: () => groupService.getGroup(id),
    enabled: !!id,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGroupPayload) =>
      groupService.createGroup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.lists() });
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateGroupPayload & { id: string }) =>
      groupService.updateGroup(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.detail(id) });
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => groupService.deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.lists() });
    },
  });
}
