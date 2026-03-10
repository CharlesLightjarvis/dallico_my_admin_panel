import type { Question, QuestionType } from "./question";

export interface Part {
  id: string;
  modelltest_module_id: string;
  order: number;
  label: string | null;
  question_type: QuestionType;
  instructions: string;
  context_text: string | null;
  context_audio_url: string | null;
  created_at: string;
  updated_at: string;
  choices: PartChoice[];
  questions: Question[];
}

export interface PartChoiceDraft {
  id?: string;
  label: string;
  text: string;
  image_url?: string | null;
  is_correct: boolean;
  order: number;
}

export interface PartChoice {
  id: string;
  label: string;
  text: string | null;
  image_url: string | null;
  is_correct: boolean;
  order: number;
  question_id: string | null;
}

export interface CreatePartPayload {
  modelltest_module_id: string;
  order: number;
  label?: string | null;
  question_type: string;
  instructions: string;
  context_text?: string | null;
}

export interface UpdatePartPayload extends Partial<CreatePartPayload> {}
