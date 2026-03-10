import type { QuestionType } from "../types/question-type";

const questionTypeStyles: Record<QuestionType, { badge: string; label: string }> = {
  mcq: {
    badge: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
    label: "MCQ",
  },
  true_false: {
    badge: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
    label: "Vrai / Faux",
  },
  ja_nein: {
    badge: "bg-teal-500/10 text-teal-600 border border-teal-500/20",
    label: "Ja / Nein",
  },
  open_text: {
    badge: "bg-violet-500/10 text-violet-600 border border-violet-500/20",
    label: "Texte libre",
  },
  gap_fill: {
    badge: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
    label: "Texte à trous",
  },
  matching: {
    badge: "bg-orange-500/10 text-orange-600 border border-orange-500/20",
    label: "Correspondance",
  },
  ordering: {
    badge: "bg-pink-500/10 text-pink-600 border border-pink-500/20",
    label: "Mise en ordre",
  },
  announcement_matching: {
    badge: "bg-cyan-500/10 text-cyan-600 border border-cyan-500/20",
    label: "Annonce",
  },
};

export function getQuestionTypeStyle(type: QuestionType) {
  return (
    questionTypeStyles[type] ?? {
      badge: "bg-gray-500/10 text-gray-500 border border-gray-500/20",
      label: type,
    }
  );
}
