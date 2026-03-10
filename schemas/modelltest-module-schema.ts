import { z } from "zod";

export const createModelltestModuleSchema = z.object({
  modelltestId: z.string().uuid(),
  moduleId: z.string().uuid(),
  order: z.number().int().min(1),
  isActive: z.boolean(),
});

export const updateModelltestModuleSchema = z.object({
  order: z.number().int().min(1),
  isActive: z.boolean(),
});

export type CreateModelltestModuleFormData = z.infer<
  typeof createModelltestModuleSchema
>;
export type UpdateModelltestModuleFormData = z.infer<
  typeof updateModelltestModuleSchema
>;
