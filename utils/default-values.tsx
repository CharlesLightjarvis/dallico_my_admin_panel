// ── Helpers par type ──────────────────────────────────────────────────────────

import type { ChoiceDraft } from "../types/choice";
import type { QuestionDraft, QuestionType } from "../types/question";

export function defaultChoicesForType(type: QuestionType): ChoiceDraft[] {
  switch (type) {
    case "MCQ_ABC":
      return [
        { label: "a", text: "", is_correct: false, order: 1 },
        { label: "b", text: "", is_correct: false, order: 2 },
        { label: "c", text: "", is_correct: false, order: 3 },
      ];
    case "RICHTIG_FALSCH":
      return [
        { label: "richtig", text: "Richtig", is_correct: true, order: 1 },
        { label: "falsch", text: "Falsch", is_correct: false, order: 2 },
      ];
    case "JA_NEIN":
    case "JA_NEIN_PERSON":
      return [
        { label: "ja", text: "Ja", is_correct: true, order: 1 },
        { label: "nein", text: "Nein", is_correct: false, order: 2 },
      ];
    case "PLUS_MINUS":
      return [
        { label: "+", text: "Richtig", is_correct: true, order: 1 },
        { label: "-", text: "Falsch", is_correct: false, order: 2 },
      ];
    default:
      return [];
  }
}

export function defaultQuestion(
  order: number,
  type: QuestionType
): QuestionDraft {
  return {
    order,
    content: "",
    gap_number: null,
    image_url: null,
    audio_url: null,
    points: 1,
    sub_type: null,
    correct_answer: null,
    choices: defaultChoicesForType(type),
    removed_choice_ids: [],
  };
}

// Types qui ont des choices au niveau question
export const QUESTION_CHOICE_TYPES: QuestionType[] = [
  "MCQ_ABC",
  "RICHTIG_FALSCH",
  "JA_NEIN",
  "JA_NEIN_PERSON",
  "PLUS_MINUS",
  "DRAG_DROP_MOT",
];
// Types qui ont des choices au niveau part (annonces/liste)
export const PART_CHOICE_TYPES: QuestionType[] = ["ZUORDNUNG", "DRAG_DROP_MOT"];
// Types avec gap_number
export const GAP_TYPES: QuestionType[] = ["DRAG_DROP_MOT", "DRAG_DROP_PHRASE"];
// Types sans questions
export const NO_QUESTION_TYPES: QuestionType[] = ["FREITEXT"];
