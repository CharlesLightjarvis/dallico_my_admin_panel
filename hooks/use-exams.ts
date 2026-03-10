import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../config/query-keys";
import { examService } from "../services/exam-service";
import type { CreateExamPayload, UpdateExamPayload } from "types/exam";

export function useExams() {
  return useQuery({
    queryKey: queryKeys.exams.lists(),
    queryFn: () => examService.getExams(),
  });
}

export function useExam(id: string) {
  return useQuery({
    queryKey: queryKeys.exams.detail(id),
    queryFn: () => examService.getExam(id),
    enabled: !!id,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateExamPayload) => examService.createExam(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exams.lists() });
    },
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateExamPayload & { id: string }) =>
      examService.updateExam(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exams.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.exams.detail(id) });
    },
  });
}

export function useDeleteExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => examService.deleteExam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exams.lists() });
    },
  });
}
