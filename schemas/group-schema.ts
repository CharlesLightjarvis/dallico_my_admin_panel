import { z } from "zod";

export const createGroupSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  is_active: z.boolean(),
  exam_id: z.string().uuid("Examen requis"),
  level_id: z.string().uuid("Niveau requis"),
});

export const updateGroupSchema = createGroupSchema.partial();

export type CreateGroupFormData = z.infer<typeof createGroupSchema>;
export type UpdateGroupFormData = z.infer<typeof updateGroupSchema>;

export const createGroupDefaultValues: CreateGroupFormData = {
  name: "",
  is_active: true,
  exam_id: "",
  level_id: "",
};
