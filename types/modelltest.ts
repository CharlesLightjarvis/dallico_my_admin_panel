import type { Group } from "./group";
import type { ModelltestModule } from "./modelltest-module";

export interface Modelltest {
  id: string;
  title: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  group?: Pick<Group, "id" | "name">;
  modelltest_modules: ModelltestModule[];
}

export interface CreateModelltestPayload {
  title: string;
  is_active: boolean;
  group_id: string;
  modules: {
    module_id: string;
    audio_url?: string | null;
    is_active: boolean;
  }[];
}

export interface UpdateModelltestPayload extends Partial<CreateModelltestPayload> {}
