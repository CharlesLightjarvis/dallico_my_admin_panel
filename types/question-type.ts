export const QUESTION_TYPES = [
  { label: "Choix multiple (MCQ)", value: "mcq" },
  { label: "Vrai / Faux", value: "true_false" },
  { label: "Ja / Nein", value: "ja_nein" },
  { label: "Texte libre", value: "open_text" },
  { label: "Texte à trous", value: "gap_fill" },
  { label: "Correspondance", value: "matching" },
  { label: "Mise en ordre", value: "ordering" },
  { label: "Annonce", value: "announcement_matching" },
  { label: "Texte à trous (glisser)", value: "gap_fill_drag" },
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number]["value"];
