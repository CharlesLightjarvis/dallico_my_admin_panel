import { QUESTION_TYPES, type QuestionType } from "../types/question";
import { z } from "zod";

export const createPartSchema = z.object({
  modelltest_module_id: z.string().uuid("Module requis"),
  order: z.number().min(1, "L'ordre est requis"),
  label: z.string().nullable().optional(),
  question_type: z.enum(QUESTION_TYPES as [QuestionType, ...QuestionType[]], {
    required_error: "Type requis",
  }),
  instructions: z.string().min(1, "Les instructions sont requises"),
  context_text: z.string().nullable().optional(),
  context_audio_url: z.string().url("URL invalide").nullable().optional(),
});

export const updatePartSchema = createPartSchema.partial();

export type CreatePartFormData = z.infer<typeof createPartSchema>;
export type UpdatePartFormData = z.infer<typeof updatePartSchema>;

export const createPartDefaultValues: CreatePartFormData = {
  modelltest_module_id: "",
  order: 1,
  label: null,
  question_type: "MCQ_ABC",
  instructions: "",
  context_text: null,
};
