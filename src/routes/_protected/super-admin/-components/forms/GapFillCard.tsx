import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { QuestionDraft } from "../../../../../../schemas/question-schema";

type Segment = { type: "text"; value: string } | { type: "gap"; gapNum: number };

/** Accepte le JSON segments {"t":...}|{"gap":N} stocké en DB. */
function parseContent(content: string): Segment[] {
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed.map((s) =>
        "gap" in s
          ? { type: "gap" as const, gapNum: s.gap }
          : { type: "text" as const, value: s.t ?? "" },
      );
    }
  } catch {}
  // fallback : texte brut
  return [{ type: "text", value: content }];
}

interface GapFillCardProps {
  content: string;
  isDisabled: boolean;
  questions: { draft: QuestionDraft; originalIndex: number }[];
  onAddQuestion: () => void;
  onChange: (originalIndex: number, updates: Partial<QuestionDraft>) => void;
  onRemove: (originalIndex: number) => void;
}

export function GapFillCard({
  content,
  isDisabled,
  questions,
  onAddQuestion,
  onChange,
  onRemove,
}: GapFillCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-5">
      {/* ── Aperçu texte ──────────────────────────────────────────── */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Aperçu du texte{" "}
          <span className="normal-case font-normal">
            — utilisez{" "}
            <code className="text-xs bg-muted px-1 rounded">___(N)___</code>{" "}
            dans le contenu pour marquer les vides
          </span>
        </p>
        {content.trim() ? (
          <div className="bg-muted/50 rounded-md p-3 leading-8 text-sm text-foreground">
            {parseContent(content).map((seg, i) =>
              seg.type === "text" ? (
                <span key={i}>{seg.value}</span>
              ) : (
                <span
                  key={i}
                  className="inline-flex items-center justify-center bg-primary/10 border border-primary/40 rounded px-2 py-0.5 mx-0.5 text-primary font-semibold text-xs"
                >
                  ({seg.gapNum})
                </span>
              ),
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            Aucun contenu — remplissez le champ "Contenu" dans l'onglet
            "Partie".
          </p>
        )}
      </div>

      <div className="border-t" />

      {/* ── Vides / Questions ─────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Vides{" "}
            <span className="normal-case font-normal">
              — 3 choix par vide, cochez la bonne réponse
            </span>
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddQuestion}
            disabled={isDisabled}
          >
            <Plus className="size-3.5 mr-1" />
            Ajouter un vide
          </Button>
        </div>

        {questions.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">
            Aucun vide — cliquez sur "Ajouter un vide".
          </p>
        ) : (
          <div className="space-y-3">
            {questions.map(({ draft, originalIndex }, qIdx) => (
              <div
                key={originalIndex}
                className="border rounded-md p-3 space-y-2 bg-background"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary">
                    Vide {qIdx + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(originalIndex)}
                    disabled={isDisabled}
                    className="h-6 w-6 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>

                <div className="space-y-1.5">
                  {draft.choices.map((choice, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`gap-${originalIndex}-correct`}
                        checked={choice.isCorrect}
                        onChange={() =>
                          onChange(originalIndex, {
                            choices: draft.choices.map((c, i) => ({
                              ...c,
                              isCorrect: i === cIdx,
                            })),
                          })
                        }
                        disabled={isDisabled}
                        title="Bonne réponse"
                        className="h-4 w-4 shrink-0 cursor-pointer accent-primary disabled:cursor-not-allowed"
                      />
                      <Input
                        value={choice.choiceText}
                        onChange={(e) =>
                          onChange(originalIndex, {
                            choices: draft.choices.map((c, i) =>
                              i === cIdx
                                ? { ...c, choiceText: e.target.value }
                                : c,
                            ),
                          })
                        }
                        placeholder={`Choix ${cIdx + 1}`}
                        disabled={isDisabled}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
