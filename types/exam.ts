import type { ExamLevel } from "./exam-level";

export interface Exam {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  exam_levels: ExamLevel[];
  created_at: string;
  updated_at: string;
}

export interface CreateExamPayload {
  name: string;
  description?: string | null;
  image_url?: string | null;
  is_active: boolean;
  levels: {
    level_id: string;
    is_active: boolean;
  }[];
}

export interface UpdateExamPayload extends Partial<CreateExamPayload> {}
