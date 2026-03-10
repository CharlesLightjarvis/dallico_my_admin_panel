import { api } from "@/lib/api";
import type { Exam, CreateExamPayload, UpdateExamPayload } from "types/exam";

export const examService = {
  async getExams(): Promise<Exam[]> {
    const { data } = await api.get<{ data: Exam[] }>("/api/v1/exams");
    return data.data;
  },

  async getExam(id: string): Promise<Exam> {
    const { data } = await api.get<{ data: Exam }>(`/api/v1/exams/${id}`);
    return data.data;
  },

  async createExam(payload: CreateExamPayload): Promise<Exam> {
    const { data } = await api.post<{ data: Exam }>("/api/v1/exams", payload);
    return data.data;
  },

  async updateExam(id: string, payload: UpdateExamPayload): Promise<Exam> {
    const { data } = await api.put<{ data: Exam }>(
      `/api/v1/exams/${id}`,
      payload
    );
    return data.data;
  },

  async deleteExam(id: string): Promise<void> {
    await api.delete(`/api/v1/exams/${id}`);
  },
};
