import type { Level } from "./level";
import type { Exam } from "./exam";

export interface Group {
  id: string;
  name: string;
  is_active: boolean;
  exam_level_id: string;
  created_at: string;
  updated_at: string;
  exam?: Pick<Exam, "id" | "name">;
  level?: Pick<Level, "id" | "name">;
}

export interface CreateGroupPayload {
  name: string;
  is_active: boolean;
  exam_id: string;
  level_id: string;
}

export interface UpdateGroupPayload extends Partial<CreateGroupPayload> {}
