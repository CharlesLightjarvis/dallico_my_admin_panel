import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../config/query-keys";
import { modelltestService } from "../services/modelltest-service";
import type {
  CreateModelltestPayload,
  UpdateModelltestPayload,
} from "types/modelltest";

export function useModelltests() {
  return useQuery({
    queryKey: queryKeys.modelltests.lists(),
    queryFn: () => modelltestService.getModelltests(),
  });
}

export function useModelltest(id: string) {
  return useQuery({
    queryKey: queryKeys.modelltests.detail(id),
    queryFn: () => modelltestService.getModelltest(id),
    enabled: !!id,
  });
}

export function useCreateModelltest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateModelltestPayload) =>
      modelltestService.createModelltest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.modelltests.lists(),
      });
    },
  });
}

export function useUpdateModelltest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: UpdateModelltestPayload & { id: string }) =>
      modelltestService.updateModelltest(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.modelltests.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.modelltests.detail(id),
      });
    },
  });
}

export function useDeleteModelltest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => modelltestService.deleteModelltest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.modelltests.lists(),
      });
    },
  });
}
