import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { isAxiosError } from "@/lib/api";
import { myGoeyToast } from "@/lib/goey-toast-presets";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createExamSchema,
  type CreateExamFormData,
} from "../../../../../../../schemas/exam-schema";
import { EXAM_STATUS } from "../../../../../../../types/exam-status";
import { useUpdateExam } from "../../../../../../../hooks/use-exams";
import { useLevels } from "../../../../../../../hooks/use-levels";
import { getLevelBadgeStyle } from "../../../../../../../utils/level-styles";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
} from "@/components/optics/dialog";
import type { Exam } from "../../../../../../../types/exam";

interface UpdateExamProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: Exam | null;
}

export function UpdateExam({ open, onOpenChange, exam }: UpdateExamProps) {
  const updateExam = useUpdateExam();
  const { data: allLevels = [] } = useLevels();

  const form = useForm<CreateExamFormData>({
    resolver: zodResolver(createExamSchema),
    defaultValues: {
      name: exam?.name,
      description: exam?.description ?? null,
      image_url: exam?.image_url ?? null,
      is_active: exam?.is_active,
      levels: exam?.exam_levels.map((el) => ({
        level_id: el.level_id,
        is_active: el.is_active,
      })),
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "levels",
  });

  const getFieldIndex = (level_id: string) =>
    fields.findIndex((f) => f.level_id === level_id);

  const toggleLevel = (level_id: string) => {
    const idx = getFieldIndex(level_id);
    if (idx >= 0) {
      remove(idx);
    } else {
      append({ level_id, is_active: true });
    }
  };

  const onSubmit = async (data: CreateExamFormData) => {
    try {
      await updateExam.mutateAsync({ id: exam?.id || "", ...data });
      onOpenChange(false);
      myGoeyToast("success", "Examen modifié", {
        description: "L'examen a été mis à jour avec succès.",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        myGoeyToast("error", "Erreur de modification", {
          description: "Une erreur est survenue. Veuillez réessayer.",
        });
      } else {
        myGoeyToast("error", "Erreur inattendue", {
          description:
            "Une erreur inattendue est survenue. Veuillez réessayer.",
        });
      }
    }
  };

  // Reset avec les données de l'exam quand il change
  React.useEffect(() => {
    if (open && exam) {
      form.reset({
        name: exam.name,
        description: exam.description ?? null,
        image_url: exam.image_url ?? null,
        is_active: exam.is_active,
        levels: exam.exam_levels.map((el) => ({
          level_id: el.level_id,
          is_active: el.is_active,
        })),
      });
    }
  }, [open, exam, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup
        className="sm:max-w-3xl"
        containerClassName="sm:max-w-3xl max-h-[85vh] gap-4"
      >
        <DialogHeader>
          <DialogTitle>Modifier l'examen</DialogTitle>
          <DialogDescription>
            Modifiez les informations et les niveaux associés.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="overflow-y-auto flex-1 min-h-0 pr-1 pb-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Nom */}
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="update-exam-name">Nom</FieldLabel>
                    <Input
                      {...field}
                      id="update-exam-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Nom de l'examen"
                      disabled={updateExam.isPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Statut */}
              <Controller
                name="is_active"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="update-exam-status">Statut</FieldLabel>
                    <Select
                      value={field.value ? "active" : "inactive"}
                      onValueChange={(v) => field.onChange(v === "active")}
                      disabled={updateExam.isPending}
                    >
                      <SelectTrigger
                        id="update-exam-status"
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Sélectionnez un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXAM_STATUS.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* URL de l'image */}
              <Controller
                name="image_url"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    className="col-span-2"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor="update-exam-image-url">
                      URL de l'image
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      id="update-exam-image-url"
                      aria-invalid={fieldState.invalid}
                      placeholder="https://..."
                      disabled={updateExam.isPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Description */}
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    className="col-span-2"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor="update-exam-description">
                      Description
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      id="update-exam-description"
                      aria-invalid={fieldState.invalid}
                      placeholder="Description de l'examen"
                      disabled={updateExam.isPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Niveaux */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Niveaux</p>
              <div className="rounded-md border divide-y">
                {[...allLevels]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((level) => {
                    const idx = getFieldIndex(level.id);
                    const isSelected = idx >= 0;
                    const styles = getLevelBadgeStyle(level.name, true);

                    return (
                      <div
                        key={level.id}
                        className="flex items-center gap-3 px-3 py-2.5"
                      >
                        <input
                          type="checkbox"
                          id={`update-level-${level.id}`}
                          checked={isSelected}
                          onChange={() => toggleLevel(level.id)}
                          disabled={updateExam.isPending}
                          className="h-4 w-4 rounded border-gray-300 accent-primary cursor-pointer"
                        />

                        <label
                          htmlFor={`update-level-${level.id}`}
                          className="flex items-center gap-2 flex-1 cursor-pointer"
                        >
                          <span
                            className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold ${styles.badge}`}
                          >
                            {level.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {level.name}
                          </span>
                        </label>

                        {isSelected && (
                          <div className="flex items-center gap-2 ml-auto">
                            <Controller
                              name={`levels.${idx}.is_active`}
                              control={form.control}
                              render={({ field }) => (
                                <Select
                                  value={field.value ? "active" : "inactive"}
                                  onValueChange={(v) =>
                                    field.onChange(v === "active")
                                  }
                                  disabled={updateExam.isPending}
                                >
                                  <SelectTrigger className="h-7 w-24 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">
                                      Actif
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                      Inactif
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}

                {allLevels.length === 0 && (
                  <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                    Aucun niveau disponible
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateExam.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={updateExam.isPending}>
              {updateExam.isPending ? "Modification..." : "Modifier l'examen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogPopup>
    </Dialog>
  );
}
