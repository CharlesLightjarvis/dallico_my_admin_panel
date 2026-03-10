import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { isAxiosError, extractJsonApiFieldErrors } from "@/lib/api";
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
  createExamDefaultValues,
  type CreateExamFormData,
} from "../../../../../../../schemas/exam-schema";
import { EXAM_STATUS } from "../../../../../../../types/exam-status";
import { useCreateExam } from "../../../../../../../hooks/use-exams";
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

interface CreateExamProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateExam({ open, onOpenChange }: CreateExamProps) {
  const createExam = useCreateExam();
  const { data: allLevels = [] } = useLevels();

  const form = useForm<CreateExamFormData>({
    resolver: zodResolver(createExamSchema),
    defaultValues: createExamDefaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "levels",
  });

  const getFieldIndex = (level_id: string) =>
    fields.findIndex((f) => f.level_id === level_id);

  const toggleLevel = (levelId: string) => {
    const idx = getFieldIndex(levelId);
    if (idx >= 0) {
      remove(idx);
    } else {
      append({ level_id: levelId, is_active: true });
    }
  };

  const onSubmit = async (data: CreateExamFormData) => {
    try {
      await createExam.mutateAsync(data);
      form.reset();
      onOpenChange(false);
      myGoeyToast("success", "Examen créé", {
        description: "Le nouvel examen a été créé avec succès.",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        myGoeyToast("error", "Erreur de création", {
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

  React.useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup
        className="sm:max-w-3xl"
        containerClassName="sm:max-w-3xl max-h-[85vh] gap-4"
      >
        <DialogHeader>
          <DialogTitle>Créer un nouvel examen</DialogTitle>
          <DialogDescription>
            Remplissez les informations et sélectionnez les niveaux associés.
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
                    <FieldLabel htmlFor="create-exam-name">Nom</FieldLabel>
                    <Input
                      {...field}
                      id="create-exam-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Nom de l'examen"
                      disabled={createExam.isPending}
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
                    <FieldLabel htmlFor="create-exam-status">Statut</FieldLabel>
                    <Select
                      value={field.value ? "active" : "inactive"}
                      onValueChange={(v) => field.onChange(v === "active")}
                      disabled={createExam.isPending}
                    >
                      <SelectTrigger
                        id="create-exam-status"
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
                    <FieldLabel htmlFor="create-exam-image-url">
                      URL de l'image
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      id="create-exam-image-url"
                      aria-invalid={fieldState.invalid}
                      placeholder="https://..."
                      disabled={createExam.isPending}
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
                    <FieldLabel htmlFor="create-exam-description">
                      Description
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      id="create-exam-description"
                      aria-invalid={fieldState.invalid}
                      placeholder="Description de l'examen"
                      disabled={createExam.isPending}
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
                          id={`create-level-${level.id}`}
                          checked={isSelected}
                          onChange={() => toggleLevel(level.id)}
                          disabled={createExam.isPending}
                          className="h-4 w-4 rounded border-gray-300 accent-primary cursor-pointer"
                        />

                        <label
                          htmlFor={`create-level-${level.id}`}
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
                                  disabled={createExam.isPending}
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
              disabled={createExam.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={createExam.isPending}>
              {createExam.isPending ? "Création..." : "Créer l'examen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogPopup>
    </Dialog>
  );
}
