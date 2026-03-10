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
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
} from "@/components/optics/dialog";
import {
  createModelltestSchema,
  type CreateModelltestFormData,
} from "../../../../../../../schemas/modelltest-schema";
import { MODELLTEST_STATUS } from "../../../../../../../types/modelltest-status";
import { useUpdateModelltest } from "../../../../../../../hooks/use-modelltests";
import { useGroups } from "../../../../../../../hooks/use-groups";
import { useModules } from "../../../../../../../hooks/use-modules";
import { getModuleStyle } from "../../../../../../../utils/module-styles";
import type { Modelltest } from "../../../../../../../types/modelltest";

interface UpdateModelltestProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modelltest: Modelltest | null;
}

export function UpdateModelltest({
  open,
  onOpenChange,
  modelltest,
}: UpdateModelltestProps) {
  const updateModelltest = useUpdateModelltest();
  const { data: allGroups = [] } = useGroups();
  const { data: allModules = [] } = useModules();

  const form = useForm<CreateModelltestFormData>({
    resolver: zodResolver(createModelltestSchema),
    defaultValues: {
      title: "",
      is_active: true,
      group_id: "",
      modules: [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "modules",
  });

  const getFieldIndex = (module_id: string) =>
    fields.findIndex((f) => f.module_id === module_id);

  const toggleModule = (module_id: string) => {
    const idx = getFieldIndex(module_id);
    if (idx >= 0) {
      remove(idx);
    } else {
      append({ module_id, audio_url: null, is_active: true });
    }
  };

  React.useEffect(() => {
    if (open && modelltest) {
      form.reset({
        title: modelltest.title,
        is_active: modelltest.is_active,
        group_id: modelltest.group?.id ?? "",
        modules: modelltest.modelltest_modules.map((mm) => ({
          module_id: mm.module_id,
          audio_url: mm.audio_url,
          is_active: mm.is_active,
        })),
      });
    }
  }, [open, modelltest, form]);

  if (!modelltest) return null;

  const onSubmit = async (data: CreateModelltestFormData) => {
    try {
      await updateModelltest.mutateAsync({ id: modelltest.id, ...data });
      onOpenChange(false);
      myGoeyToast("success", "Modelltest modifié", {
        description: "Le modelltest a été mis à jour avec succès.",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup
        className="sm:max-w-3xl"
        containerClassName="sm:max-w-3xl max-h-[85vh] gap-4"
      >
        <DialogHeader>
          <DialogTitle>Modifier le modelltest</DialogTitle>
          <DialogDescription>
            Modifiez les informations et les modules associés.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="overflow-y-auto flex-1 min-h-0 pr-1 pb-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Titre */}
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="update-mt-title">Titre</FieldLabel>
                    <Input
                      {...field}
                      id="update-mt-title"
                      placeholder="Modelltest 1"
                      disabled={updateModelltest.isPending}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Groupe */}
              <Controller
                name="group_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="update-mt-group">Groupe</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={updateModelltest.isPending}
                    >
                      <SelectTrigger
                        id="update-mt-group"
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Sélectionnez un groupe" />
                      </SelectTrigger>
                      <SelectContent>
                        {allGroups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
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

              {/* Statut */}
              <Controller
                name="is_active"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="update-mt-status">Statut</FieldLabel>
                    <Select
                      value={field.value ? "active" : "inactive"}
                      onValueChange={(v) => field.onChange(v === "active")}
                      disabled={updateModelltest.isPending}
                    >
                      <SelectTrigger
                        id="update-mt-status"
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Sélectionnez un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        {MODELLTEST_STATUS.map((s) => (
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
            </div>

            {/* Modules */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Modules</p>
              <div className="rounded-md border divide-y">
                {[...allModules]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((module) => {
                    const idx = getFieldIndex(module.id);
                    const isSelected = idx >= 0;
                    const styles = getModuleStyle(module.name, true);

                    return (
                      <div
                        key={module.id}
                        className="flex items-center gap-3 px-3 py-2.5"
                      >
                        <input
                          type="checkbox"
                          id={`update-module-${module.id}`}
                          checked={isSelected}
                          onChange={() => toggleModule(module.id)}
                          disabled={updateModelltest.isPending}
                          className="h-4 w-4 rounded border-gray-300 accent-primary cursor-pointer"
                        />
                        <label
                          htmlFor={`update-module-${module.id}`}
                          className="flex items-center gap-2 flex-1 cursor-pointer"
                        >
                          <span
                            className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold ${styles.badge}`}
                          >
                            {module.name}
                          </span>
                        </label>

                        {isSelected && (
                          <div className="flex items-center gap-2 ml-auto">
                            {module.name === "Hören" && (
                              <Controller
                                name={`modules.${idx}.audio_url`}
                                control={form.control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                      field.onChange(e.target.value || null)
                                    }
                                    placeholder="URL audio..."
                                    className="h-7 w-48 text-xs"
                                    disabled={updateModelltest.isPending}
                                  />
                                )}
                              />
                            )}
                            <Controller
                              name={`modules.${idx}.is_active`}
                              control={form.control}
                              render={({ field }) => (
                                <Select
                                  value={field.value ? "active" : "inactive"}
                                  onValueChange={(v) =>
                                    field.onChange(v === "active")
                                  }
                                  disabled={updateModelltest.isPending}
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
                {allModules.length === 0 && (
                  <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                    Aucun module disponible
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
              disabled={updateModelltest.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={updateModelltest.isPending}>
              {updateModelltest.isPending
                ? "Modification..."
                : "Modifier le modelltest"}
            </Button>
          </DialogFooter>
        </form>
      </DialogPopup>
    </Dialog>
  );
}
