import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QuestionDraft } from "../../../../../../schemas/question-schema";
import { QUESTION_TYPES } from "../../../../../../types/question-type";

const textareaClass =
  "border-input dark:bg-input/30 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm resize-none";

interface QuestionDraftCardProps {
  draft: QuestionDraft;
  index: number;
  isDisabled: boolean;
  onChange: (updates: Partial<QuestionDraft>) => void;
  onRemove: () => void;
}

export function QuestionDraftCard({
  draft,
  index,
  isDisabled,
  onChange,
  onRemove,
}: QuestionDraftCardProps) {
  const isTrueFalse = draft.questionType === "true_false";
  const isJaNein = draft.questionType === "ja_nein";
  const isMcq = draft.questionType === "mcq";
  const showChoices = isMcq || isTrueFalse || isJaNein;
  const showFixedChoices = isTrueFalse || isJaNein;

  // Sélectionner UNE seule bonne réponse (radio behavior)
  const selectCorrect = (choiceIndex: number) => {
    onChange({
      choices: draft.choices.map((c, i) => ({
        ...c,
        isCorrect: i === choiceIndex,
      })),
    });
  };

  const addChoice = () => {
    onChange({
      choices: [
        ...draft.choices,
        { choiceText: "", isCorrect: false, order: draft.choices.length + 1 },
      ],
    });
  };

  const removeChoice = (choiceIndex: number) => {
    const choice = draft.choices[choiceIndex];
    onChange({
      choices: draft.choices.filter((_, i) => i !== choiceIndex),
      removedChoiceIds: choice.id
        ? [...draft.removedChoiceIds, choice.id]
        : draft.removedChoiceIds,
    });
  };

  const updateChoiceText = (choiceIndex: number, text: string) => {
    onChange({
      choices: draft.choices.map((c, i) =>
        i === choiceIndex ? { ...c, choiceText: text } : c
      ),
    });
  };

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Question {index + 1}</p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={isDisabled}
          className="h-7 w-7 text-destructive hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {/* Type / Ordre / Points */}
      <div className="grid grid-cols-3 gap-3">
        <Field>
          <FieldLabel>Type</FieldLabel>
          <Select
            value={draft.questionType}
            onValueChange={(v) =>
              onChange({ questionType: v as QuestionDraft["questionType"] })
            }
            disabled={isDisabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUESTION_TYPES.map((qt) => (
                <SelectItem key={qt.value} value={qt.value}>
                  {qt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>Ordre</FieldLabel>
          <Input
            type="number"
            min={1}
            value={draft.order}
            onChange={(e) => onChange({ order: Number(e.target.value) })}
            disabled={isDisabled}
          />
        </Field>

        <Field>
          <FieldLabel>Points</FieldLabel>
          <Input
            type="number"
            min={1}
            value={draft.points}
            onChange={(e) => onChange({ points: Number(e.target.value) })}
            disabled={isDisabled}
          />
        </Field>
      </div>

      {/* Énoncé */}
      <Field>
        <FieldLabel>Énoncé</FieldLabel>
        <textarea
          value={draft.questionText}
          onChange={(e) => onChange({ questionText: e.target.value })}
          rows={2}
          placeholder="Énoncé de la question..."
          disabled={isDisabled}
          className={textareaClass}
        />
      </Field>

      {/* Explication */}
      <Field>
        <FieldLabel>
          Explication{" "}
          <span className="text-muted-foreground font-normal">(optionnelle)</span>
        </FieldLabel>
        <textarea
          value={draft.explanation ?? ""}
          onChange={(e) => onChange({ explanation: e.target.value || null })}
          rows={1}
          placeholder="Explication affichée après la réponse..."
          disabled={isDisabled}
          className={textareaClass}
        />
      </Field>

      {/* Réponses — Vrai/Faux ou Ja/Nein */}
      {showChoices && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Réponses{" "}
              <span className="normal-case font-normal">
                — cochez la bonne réponse
              </span>
            </p>
            {isMcq && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addChoice}
                disabled={isDisabled}
              >
                <Plus className="size-3.5 mr-1" />
                Ajouter
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {showFixedChoices ? (
              // Richtig/Falsch ou Ja/Nein — labels fixes, radio uniquement
              draft.choices.map((choice, choiceIndex) => (
                <label
                  key={choiceIndex}
                  className="flex items-center gap-3 cursor-pointer select-none"
                >
                  <input
                    type="radio"
                    name={`q-${index}-correct`}
                    checked={choice.isCorrect}
                    onChange={() => selectCorrect(choiceIndex)}
                    disabled={isDisabled}
                    className="h-4 w-4 shrink-0 cursor-pointer accent-primary disabled:cursor-not-allowed"
                  />
                  <span
                    className={`text-sm font-semibold ${
                      choice.choiceText === "Richtig" || choice.choiceText === "Ja"
                        ? "text-emerald-600"
                        : "text-destructive"
                    }`}
                  >
                    {choice.choiceText}
                  </span>
                </label>
              ))
            ) : (
              // MCQ — input + radio + supprimer
              draft.choices.map((choice, choiceIndex) => (
                <div key={choiceIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`q-${index}-correct`}
                    checked={choice.isCorrect}
                    onChange={() => selectCorrect(choiceIndex)}
                    disabled={isDisabled}
                    title="Bonne réponse"
                    className="h-4 w-4 shrink-0 cursor-pointer accent-primary disabled:cursor-not-allowed"
                  />
                  <Input
                    value={choice.choiceText}
                    onChange={(e) =>
                      updateChoiceText(choiceIndex, e.target.value)
                    }
                    placeholder={`Réponse ${choiceIndex + 1}`}
                    disabled={isDisabled}
                  />
                  {draft.choices.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeChoice(choiceIndex)}
                      disabled={isDisabled}
                      className="shrink-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
