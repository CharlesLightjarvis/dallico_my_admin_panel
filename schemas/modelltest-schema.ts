import { z } from "zod";

export const createModelltestSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  is_active: z.boolean(),
  group_id: z.string().uuid("Groupe requis"),
  modules: z.array(
    z.object({
      module_id: z.string().uuid(),
      audio_url: z.string().url("URL invalide").nullable().optional(),
      is_active: z.boolean(),
    })
  ),
});

export const updateModelltestSchema = createModelltestSchema.partial();

export type CreateModelltestFormData = z.infer<typeof createModelltestSchema>;
export type UpdateModelltestFormData = z.infer<typeof updateModelltestSchema>;

export const createModelltestDefaultValues: CreateModelltestFormData = {
  title: "",
  is_active: true,
  group_id: "",
  modules: [],
};

export const getUpdateModelltestDefaultValues = (
  modelltest: UpdateModelltestFormData
): UpdateModelltestFormData => ({
  title: modelltest.title ?? "",
  is_active: modelltest.is_active ?? true,
  group_id: modelltest.group_id ?? "",
  modules: modelltest.modules ?? [],
});
