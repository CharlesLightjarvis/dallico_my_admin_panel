export interface Choice {
  id: string;
  question_id: string | null;
  part_id: string | null;
  order: number;
  label: string;
  text: string | null;
  image_url: string | null;
  is_correct: boolean;
}

// Drafts pour le formulaire
export interface ChoiceDraft {
  id?: string;
  label: string;
  text: string;
  image_url?: string | null;
  is_correct: boolean;
  order: number;
}
