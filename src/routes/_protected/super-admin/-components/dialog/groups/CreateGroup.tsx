import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
  createGroupSchema,
  createGroupDefaultValues,
  type CreateGroupFormData,
} from "../../../../../../../schemas/group-schema";
import { GROUP_STATUS } from "../../../../../../../types/group-status";
import { useCreateGroup } from "../../../../../../../hooks/use-groups";
import { useExams } from "../../../../../../../hooks/use-exams";
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

interface CreateGroupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGroup({ open, onOpenChange }: CreateGroupProps) {
  const createGroup = useCreateGroup();
  const { data: allExams = [] } = useExams();
  const { data: allLevels = [] } = useLevels();

  const form = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: createGroupDefaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: CreateGroupFormData) => {
    try {
      await createGroup.mutateAsync(data);
      form.reset();
      onOpenChange(false);
      myGoeyToast("success", "Groupe créé", {
        description: "Le nouveau groupe a été créé avec succès.",
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
    if (!open) form.reset();
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup
        className="sm:max-w-2xl"
        containerClassName="sm:max-w-2xl max-h-[85vh] gap-4"
      >
        <DialogHeader>
          <DialogTitle>Créer un nouveau groupe</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un groupe.
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
                    <FieldLabel htmlFor="create-group-name">Nom</FieldLabel>
                    <Input
                      {...field}
                      id="create-group-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Nom du groupe"
                      disabled={createGroup.isPending}
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
                    <FieldLabel htmlFor="create-group-status">
                      Statut
                    </FieldLabel>
                    <Select
                      value={field.value ? "active" : "inactive"}
                      onValueChange={(v) => field.onChange(v === "active")}
                      disabled={createGroup.isPending}
                    >
                      <SelectTrigger
                        id="create-group-status"
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Sélectionnez un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        {GROUP_STATUS.map((s) => (
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

              {/* Examen */}
              <Controller
                name="exam_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-group-exam">Examen</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={createGroup.isPending}
                    >
                      <SelectTrigger
                        id="create-group-exam"
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Sélectionnez un examen" />
                      </SelectTrigger>
                      <SelectContent>
                        {allExams.map((exam) => (
                          <SelectItem key={exam.id} value={exam.id}>
                            {exam.name}
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

              {/* Niveau */}
              <Controller
                name="level_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-group-level">Niveau</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={createGroup.isPending}
                    >
                      <SelectTrigger
                        id="create-group-level"
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Sélectionnez un niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...allLevels]
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((level) => {
                            const styles = getLevelBadgeStyle(level.name, true);
                            return (
                              <SelectItem key={level.id} value={level.id}>
                                <span className="flex items-center gap-2">
                                  <span
                                    className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold ${styles.badge}`}
                                  >
                                    {level.name}
                                  </span>
                                  {level.name}
                                </span>
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createGroup.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={createGroup.isPending}>
              {createGroup.isPending ? "Création..." : "Créer le groupe"}
            </Button>
          </DialogFooter>
        </form>
      </DialogPopup>
    </Dialog>
  );
}
