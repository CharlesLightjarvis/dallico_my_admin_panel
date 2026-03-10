import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { isAxiosError } from "@/lib/api";
import { myGoeyToast } from "@/lib/goey-toast-presets";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createPartSchema,
  createPartDefaultValues,
  type CreatePartFormData,
} from "../../../../../../schemas/part-schema";
import {
  QUESTION_TYPES,
  type QuestionType,
  type QuestionDraft,
} from "../../../../../../types/question";
import type { Part, PartChoiceDraft } from "../../../../../../types/part";
import { getModuleStyle } from "../../../../../../utils/module-styles";
import type { Module } from "../../../../../../types/module";
import type { ChoiceDraft } from "types/choice";
import {
  defaultQuestion,
  GAP_TYPES,
  NO_QUESTION_TYPES,
  PART_CHOICE_TYPES,
  QUESTION_CHOICE_TYPES,
} from "../../../../../../utils/default-values";

interface LockedModule {
  id: string;
  modelltestTitle: string;
  moduleName: string;
}

interface PartFormProps {
  defaultValues?: CreatePartFormData;
  initialQuestions?: QuestionDraft[];
  initialPartChoices?: PartChoiceDraft[];
  onSubmit: (
    data: CreatePartFormData,
    questions: QuestionDraft[],
    partChoices: PartChoiceDraft[]
  ) => Promise<Part>;
  isPending: boolean;
  submitLabel: string;
  pendingLabel: string;
  lockedModule?: LockedModule;
  onBack: () => void;
  onSuccess: () => void;
}

export function PartForm({
  defaultValues = createPartDefaultValues,
  initialQuestions = [],
  initialPartChoices = [],
  onSubmit,
  isPending,
  submitLabel,
  pendingLabel,
  lockedModule,
  onBack,
  onSuccess,
}: PartFormProps) {
  const form = useForm<CreatePartFormData>({
    resolver: zodResolver(createPartSchema),
    defaultValues: lockedModule
      ? { ...defaultValues, modelltest_module_id: lockedModule.id }
      : defaultValues,
    mode: "onChange",
  });

  const questionType = form.watch("question_type") as QuestionType;
  const isDisabled = isPending || form.formState.isSubmitting;

  const [questions, setQuestions] =
    React.useState<QuestionDraft[]>(initialQuestions);
  const [partChoices, setPartChoices] =
    React.useState<PartChoiceDraft[]>(initialPartChoices);

  React.useEffect(() => {
    if (initialQuestions.length > 0) {
      setQuestions(initialQuestions);
    }
  }, [initialQuestions.length]);

  React.useEffect(() => {
    if (initialPartChoices.length > 0) {
      setPartChoices(initialPartChoices);
    }
  }, [initialPartChoices.length]);

  // Reset questions/partChoices quand le type change
  const prevTypeRef = React.useRef<QuestionType>(questionType);
  React.useEffect(() => {
    if (prevTypeRef.current !== questionType) {
      setQuestions([]);
      setPartChoices([]);
      prevTypeRef.current = questionType;
    }
  }, [questionType]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      defaultQuestion(prev.length + 1, questionType),
    ]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, updates: Partial<QuestionDraft>) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, ...updates } : q))
    );
  };

  const updateChoice = (
    qIdx: number,
    cIdx: number,
    updates: Partial<ChoiceDraft>
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        return {
          ...q,
          choices: q.choices.map((c, j) =>
            j === cIdx ? { ...c, ...updates } : c
          ),
        };
      })
    );
  };

  const addPartChoice = () => {
    setPartChoices((prev) => [
      ...prev,
      {
        label: String.fromCharCode(97 + prev.length),
        text: "",
        is_correct: false,
        order: prev.length + 1,
      },
    ]);
  };

  const removePartChoice = (idx: number) => {
    setPartChoices((prev) => prev.filter((_, i) => i !== idx));
  };

  const updatePartChoice = (idx: number, updates: Partial<PartChoiceDraft>) => {
    setPartChoices((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, ...updates } : c))
    );
  };

  const handleSubmit = async (data: CreatePartFormData) => {
    try {
      await onSubmit(data, questions, partChoices);
      myGoeyToast("success", "Sauvegardé", {
        description: "La partie a été sauvegardée avec succès.",
      });
      onSuccess();
    } catch (error) {
      if (isAxiosError(error)) {
        myGoeyToast("error", "Erreur", {
          description: "Une erreur est survenue. Veuillez réessayer.",
        });
      } else {
        myGoeyToast("error", "Erreur inattendue", {
          description: "Une erreur inattendue est survenue.",
        });
      }
    }
  };

  const hasQuestions = !NO_QUESTION_TYPES.includes(questionType);
  const hasPartChoices = PART_CHOICE_TYPES.includes(questionType);
  const hasGapNumber = GAP_TYPES.includes(questionType);
  const hasQuestionChoices = QUESTION_CHOICE_TYPES.includes(questionType);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Tabs defaultValue="partie" className="space-y-4">
        <TabsList className="w-full">
          <TabsTrigger value="partie" className="flex-1">
            Partie
          </TabsTrigger>
          <TabsTrigger
            value="questions"
            className="flex-1"
            disabled={!hasQuestions}
          >
            Questions {hasQuestions ? `(${questions.length})` : "—"}
          </TabsTrigger>
        </TabsList>

        {/* ── Tab Partie ──────────────────────────────────────────────── */}
        <TabsContent value="partie" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Ordre */}
            <Controller
              name="order"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="part-order">Ordre</FieldLabel>
                  <Input
                    {...field}
                    id="part-order"
                    type="number"
                    min={1}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={isDisabled}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Label */}
            <Controller
              name="label"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="part-label">
                    Label (optionnel)
                  </FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                    id="part-label"
                    placeholder="Teil 1, Sprachbausteine…"
                    disabled={isDisabled}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Type de question */}
            <Controller
              name="question_type"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="part-qtype">Type de question</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isDisabled}
                  >
                    <SelectTrigger
                      id="part-qtype"
                      className="w-full"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {QUESTION_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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

            {/* Module */}
            {lockedModule ? (
              <Field>
                <FieldLabel>Module</FieldLabel>
                <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-border bg-muted text-sm">
                  <span className="text-muted-foreground">
                    {lockedModule.modelltestTitle}
                  </span>
                  <span className="text-muted-foreground">—</span>
                  <span
                    className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold ${getModuleStyle(lockedModule.moduleName as Module["name"], true).badge}`}
                  >
                    {lockedModule.moduleName}
                  </span>
                </div>
              </Field>
            ) : (
              <Controller
                name="modelltest_module_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="part-mm">ID du module</FieldLabel>
                    <Input
                      {...field}
                      id="part-mm"
                      disabled={isDisabled}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
          </div>

          {/* Instructions */}
          <Controller
            name="instructions"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="part-instructions">
                  Instructions
                </FieldLabel>
                <Textarea
                  {...field}
                  id="part-instructions"
                  placeholder="Lesen Sie den Text und…"
                  rows={3}
                  disabled={isDisabled}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Contexte texte */}
          <Controller
            name="context_text"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="part-context">
                  Texte de contexte (optionnel)
                </FieldLabel>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  id="part-context"
                  placeholder="Texte support, article, lettre… Utilisez {21} {22} pour les vides (DRAG_DROP_MOT)"
                  rows={6}
                  disabled={isDisabled}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Part-level choices — ZUORDNUNG annonces / DRAG_DROP_MOT liste */}
          {hasPartChoices && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {questionType === "ZUORDNUNG"
                    ? "Annonces / Options"
                    : "Liste de mots (globale)"}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPartChoice}
                  disabled={isDisabled}
                >
                  <Plus className="size-3.5 mr-1" /> Ajouter
                </Button>
              </div>
              <div className="space-y-2">
                {partChoices.map((pc, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 text-xs font-mono text-muted-foreground shrink-0">
                      {pc.label}
                    </span>
                    <Input
                      value={pc.text}
                      onChange={(e) =>
                        updatePartChoice(idx, { text: e.target.value })
                      }
                      placeholder={
                        questionType === "ZUORDNUNG"
                          ? "Texte de l'annonce…"
                          : "Mot…"
                      }
                      disabled={isDisabled}
                      className="flex-1"
                    />
                    {questionType === "ZUORDNUNG" && (
                      <label className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                        <input
                          type="checkbox"
                          checked={pc.is_correct}
                          onChange={(e) =>
                            updatePartChoice(idx, {
                              is_correct: e.target.checked,
                            })
                          }
                          disabled={isDisabled}
                          className="accent-primary"
                        />
                        Distracteur
                      </label>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePartChoice(idx)}
                      disabled={isDisabled}
                      className="shrink-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
                {partChoices.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Aucune option ajoutée.
                  </p>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── Tab Questions ────────────────────────────────────────────── */}
        <TabsContent value="questions" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {questions.length === 0
                ? "Aucune question."
                : `${questions.length} question${questions.length > 1 ? "s" : ""}`}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addQuestion}
              disabled={isDisabled}
            >
              <Plus className="size-3.5 mr-1" /> Ajouter une question
            </Button>
          </div>

          <div className="space-y-4">
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="rounded-md border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Question {q.order}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuestion(qIdx)}
                    disabled={isDisabled}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Ordre */}
                  <Field>
                    <FieldLabel>Ordre</FieldLabel>
                    <Input
                      type="number"
                      min={1}
                      value={q.order}
                      onChange={(e) =>
                        updateQuestion(qIdx, { order: Number(e.target.value) })
                      }
                      disabled={isDisabled}
                    />
                  </Field>

                  {/* Points */}
                  <Field>
                    <FieldLabel>Points</FieldLabel>
                    <Input
                      type="number"
                      min={1}
                      value={q.points}
                      onChange={(e) =>
                        updateQuestion(qIdx, { points: Number(e.target.value) })
                      }
                      disabled={isDisabled}
                    />
                  </Field>

                  {/* Gap number — DRAG_DROP_MOT */}

                  <Field>
                    <FieldLabel>Numéro de la lacune</FieldLabel>
                    <Input
                      type="number"
                      min={1}
                      value={q.gap_number ?? ""}
                      onChange={(e) =>
                        updateQuestion(qIdx, {
                          gap_number: e.target.value
                            ? Number(e.target.value)
                            : null,
                        })
                      }
                      disabled={isDisabled}
                      placeholder="21, 22…"
                    />
                  </Field>

                  {/* Correct answer — ZUORDNUNG */}
                  {questionType === "ZUORDNUNG" && (
                    <Field>
                      <FieldLabel>Réponse correcte (label)</FieldLabel>
                      <Input
                        value={q.correct_answer ?? ""}
                        onChange={(e) =>
                          updateQuestion(qIdx, {
                            correct_answer: e.target.value || null,
                          })
                        }
                        disabled={isDisabled}
                        placeholder="a, b, c… ou x"
                      />
                    </Field>
                  )}
                </div>

                {/* Contenu de la question */}
                {questionType !== "DRAG_DROP_MOT" && (
                  <Field>
                    <FieldLabel>Contenu</FieldLabel>
                    <Textarea
                      value={q.content ?? ""}
                      onChange={(e) =>
                        updateQuestion(qIdx, {
                          content: e.target.value || null,
                        })
                      }
                      disabled={isDisabled}
                      placeholder="Texte de la question…"
                      rows={2}
                    />
                  </Field>
                )}

                {/* Choices au niveau question */}
                {hasQuestionChoices && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Choix
                    </p>
                    {q.choices.map((c, cIdx) => (
                      <div key={cIdx} className="flex items-center gap-2">
                        <span className="w-6 text-xs font-mono text-muted-foreground shrink-0">
                          {c.label}
                        </span>
                        <Input
                          value={c.text}
                          onChange={(e) =>
                            updateChoice(qIdx, cIdx, { text: e.target.value })
                          }
                          disabled={
                            isDisabled ||
                            [
                              "PLUS_MINUS",
                              "RICHTIG_FALSCH",
                              "JA_NEIN",
                              "JA_NEIN_PERSON",
                            ].includes(questionType)
                          }
                          className="flex-1"
                          placeholder="Texte du choix…"
                        />
                        <label className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                          <input
                            type={
                              questionType === "MCQ_ABC" ||
                              questionType === "DRAG_DROP_MOT"
                                ? "radio"
                                : "checkbox"
                            }
                            name={`question-${qIdx}-correct`}
                            checked={c.is_correct}
                            onChange={(e) => {
                              if (
                                questionType === "MCQ_ABC" ||
                                questionType === "DRAG_DROP_MOT"
                              ) {
                                // radio — un seul correct
                                setQuestions((prev) =>
                                  prev.map((qq, i) => {
                                    if (i !== qIdx) return qq;
                                    return {
                                      ...qq,
                                      choices: qq.choices.map((cc, j) => ({
                                        ...cc,
                                        is_correct: j === cIdx,
                                      })),
                                    };
                                  })
                                );
                              } else {
                                updateChoice(qIdx, cIdx, {
                                  is_correct: e.target.checked,
                                });
                              }
                            }}
                            disabled={isDisabled}
                            className="accent-primary"
                          />
                          Correct
                        </label>
                      </div>
                    ))}
                    {/* Ajout de choix libre pour MCQ_ABC et DRAG_DROP_MOT */}
                    {(questionType === "MCQ_ABC" ||
                      questionType === "DRAG_DROP_MOT") && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateQuestion(qIdx, {
                            choices: [
                              ...q.choices,
                              {
                                label: String.fromCharCode(
                                  97 + q.choices.length
                                ),
                                text: "",
                                is_correct: false,
                                order: q.choices.length + 1,
                              },
                            ],
                          })
                        }
                        disabled={isDisabled}
                        className="text-xs"
                      >
                        <Plus className="size-3 mr-1" /> Ajouter un choix
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isDisabled}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isDisabled}>
          {isDisabled ? pendingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
