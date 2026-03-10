import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../config/query-keys";
import { partService } from "../services/part-service";
import type { CreatePartPayload, UpdatePartPayload } from "types/part";

export function usePartsByModule(modelltestModuleId: string) {
  return useQuery({
    queryKey: queryKeys.parts.byModule(modelltestModuleId),
    queryFn: () => partService.getPartsByModule(modelltestModuleId),
    enabled: !!modelltestModuleId,
  });
}

export function usePart(id: string) {
  return useQuery({
    queryKey: queryKeys.parts.detail(id),
    queryFn: () => partService.getPart(id),
    enabled: !!id,
  });
}

export function useCreatePart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePartPayload) => partService.createPart(payload),
    onSuccess: (_, { modelltest_module_id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.parts.byModule(modelltest_module_id),
      });
    },
  });
}

export function useUpdatePart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdatePartPayload & { id: string }) =>
      partService.updatePart(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.parts.byModule(data.modelltest_module_id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.parts.detail(data.id),
      });
    },
  });
}

export function useDeletePart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => partService.deletePart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parts.all });
    },
  });
}
