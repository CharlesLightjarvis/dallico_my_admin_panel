import { z } from "zod";
import type { Question } from "../types/question";
import type { QuestionType } from "../types/question-type";

export const QUESTION_TYPE_VALUES = [
  "mcq",
  "true_false",
  "ja_nein",
  "open_text",
  "gap_fill",
  "matching",
  "ordering",
  "announcement_matching",
  "gap_fill_drag",
] as const;

export const createQuestionSchema = z.object({
  partId: z.string().uuid("La partie est requise"),
  questionText: z.string().min(1, "Le texte de la question est requis"),
  questionType: z.enum(QUESTION_TYPE_VALUES, {
    required_error: "Le type de question est requis",
  }),
  correctAnswer: z.string().nullable().optional(),
  explanation: z.string().nullable(),
  order: z.number().int().min(1, "L'ordre doit être au minimum 1"),
  points: z.number().int().min(1, "Les points doivent être au minimum 1"),
});

export const updateQuestionSchema = createQuestionSchema.omit({ partId: true });

export type CreateQuestionFormData = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionFormData = z.infer<typeof updateQuestionSchema>;

export const createQuestionDefaultValues: CreateQuestionFormData = {
  partId: "",
  questionText: "",
  questionType: "mcq",
  explanation: null,
  order: 1,
  points: 1,
};

export function getUpdateQuestionDefaultValues(
  question: Question
): UpdateQuestionFormData {
  return {
    questionText: question.questionText ?? "",
    questionType: question.questionType,
    explanation: question.explanation,
    order: question.order,
    points: question.points,
  };
}

// ─── Answer choice local state ───────────────────────────────────────────────

export interface CreateAnswerChoiceData {
  questionId: string;
  choiceText: string;
  isCorrect: boolean;
  order: number;
}

export interface UpdateAnswerChoiceData {
  choiceText: string;
  isCorrect: boolean;
  order: number;
}

export interface ChoiceState {
  id?: string;
  choiceText: string;
  isCorrect: boolean;
  order: number;
}

// ─── Question draft (inline management in PartForm) ──────────────────────────

export interface QuestionDraft {
  id?: string;
  questionText: string;
  questionType: QuestionType;
  correctAnswer: string | null;
  explanation: string | null;
  order: number;
  points: number;
  choices: ChoiceState[];
  removedChoiceIds: string[];
}

export function defaultQuestionDraft(order: number): QuestionDraft {
  return {
    questionText: "",
    questionType: "mcq",
    correctAnswer: null,
    explanation: null,
    order,
    points: 1,
    choices: [
      { choiceText: "", isCorrect: false, order: 1 },
      { choiceText: "", isCorrect: false, order: 2 },
      { choiceText: "", isCorrect: false, order: 3 },
    ],
    removedChoiceIds: [],
  };
}

export function questionToQuestionDraft(question: Question): QuestionDraft {
  return {
    id: question.id,
    questionText: question.questionText ?? "",
    questionType: question.questionType,
    correctAnswer: typeof question.correctAnswer === "string" ? question.correctAnswer : null,
    explanation: question.explanation,
    order: question.order,
    points: question.points,
    choices: question.answerChoices.map((ac) => ({
      id: ac.id,
      choiceText: ac.choiceText,
      isCorrect: ac.isCorrect,
      order: ac.order,
    })),
    removedChoiceIds: [],
  };
}
