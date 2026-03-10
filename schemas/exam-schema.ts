import { z } from "zod";

export const createExamSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().nullable().optional(),
  image_url: z.string().url("URL invalide").nullable().optional(),
  is_active: z.boolean(),
  levels: z.array(
    z.object({
      level_id: z.string().uuid(),
      is_active: z.boolean(),
    })
  ),
});

export type CreateExamFormData = z.infer<typeof createExamSchema>;

export const createExamDefaultValues: CreateExamFormData = {
  name: "",
  description: null,
  image_url: null,
  is_active: true,
  levels: [],
};

export const updateExamSchema = createExamSchema.partial();
export type UpdateExamFormData = z.infer<typeof updateExamSchema>;
