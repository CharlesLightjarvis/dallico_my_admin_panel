import type { Choice, ChoiceDraft } from "./choice";

export type QuestionType =
  | "MCQ_ABC"
  | "RICHTIG_FALSCH"
  | "JA_NEIN"
  | "JA_NEIN_PERSON"
  | "PLUS_MINUS"
  | "ZUORDNUNG"
  | "DRAG_DROP_PHRASE"
  | "DRAG_DROP_MOT"
  | "IMAGE_MATCH"
  | "ATTRIBUTION"
  | "SITUATION_IMAGE_MATCH"
  | "UBERSCHRIFT"
  | "FREITEXT"
  | "MIXED_PART";

export const QUESTION_TYPES: QuestionType[] = [
  "MCQ_ABC",
  "RICHTIG_FALSCH",
  "JA_NEIN",
  "JA_NEIN_PERSON",
  "PLUS_MINUS",
  "ZUORDNUNG",
  "DRAG_DROP_PHRASE",
  "DRAG_DROP_MOT",
  "IMAGE_MATCH",
  "ATTRIBUTION",
  "SITUATION_IMAGE_MATCH",
  "UBERSCHRIFT",
  "FREITEXT",
  "MIXED_PART",
];

export interface Question {
  id: string;
  part_id: string;
  order: number;
  content: string | null;
  gap_number: number | null;
  image_url: string | null;
  audio_url: string | null;
  points: number;
  sub_type: string | null;
  correct_answer: string | null;
  choices: Choice[];
  created_at: string;
  updated_at: string;
}

export interface QuestionDraft {
  id?: string;
  order: number;
  content: string | null;
  gap_number: number | null;
  image_url?: string | null;
  audio_url?: string | null;
  points: number;
  sub_type: string | null;
  correct_answer: string | null;
  choices: ChoiceDraft[];
  // pour tracker les choix supprimés en mode edit
  removed_choice_ids: string[];
}
