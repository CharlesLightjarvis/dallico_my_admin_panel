import type { Question, QuestionDraft, QuestionType } from "./question";

export interface Part {
  id: string;
  modelltest_module_id: string;
  order: number;
  label: string | null;
  question_type: QuestionType;
  instructions: string;
  context_text: string | null;
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

// types/part.ts
export interface CreatePartPayload {
  modelltest_module_id: string;
  order: number;
  label?: string | null;
  question_type: QuestionType;
  instructions: string;
  context_text?: string | null;
  questions?: QuestionDraft[];
  part_choices?: PartChoiceDraft[];
}

export interface UpdatePartPayload extends Partial<CreatePartPayload> {
  removed_question_ids?: string[];
  removed_choice_ids?: string[];
}
