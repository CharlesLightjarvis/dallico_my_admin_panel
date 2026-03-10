import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  return [{ type: "text", value: content }];
}

interface GapFillDragCardProps {
  content: string;
  wordPool: string[];
  isDisabled: boolean;
  questions: { draft: QuestionDraft; originalIndex: number }[];
  onAddWord: () => void;
  onUpdateWord: (idx: number, value: string) => void;
  onRemoveWord: (idx: number) => void;
  onAddQuestion: () => void;
  onChange: (originalIndex: number, updates: Partial<QuestionDraft>) => void;
  onRemove: (originalIndex: number) => void;
}

export function GapFillDragCard({
  content,
  wordPool,
  isDisabled,
  questions,
  onAddWord,
  onUpdateWord,
  onRemoveWord,
  onAddQuestion,
  onChange,
  onRemove,
}: GapFillDragCardProps) {
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

      {/* ── Pool de mots ──────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Pool de mots{" "}
            <span className="normal-case font-normal">
              — proposés à l'étudiant (incluez des distracteurs)
            </span>
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddWord}
            disabled={isDisabled}
          >
            <Plus className="size-3.5 mr-1" />
            Ajouter un mot
          </Button>
        </div>

        {wordPool.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">
            Aucun mot — cliquez sur "Ajouter un mot".
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {wordPool.map((word, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <Input
                  value={word}
                  onChange={(e) => onUpdateWord(idx, e.target.value)}
                  placeholder={`Mot ${idx + 1}…`}
                  disabled={isDisabled}
                  className="w-32"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveWord(idx)}
                  disabled={isDisabled}
                  className="shrink-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t" />

      {/* ── Vides ─────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Vides{" "}
            <span className="normal-case font-normal">
              — sélectionnez la bonne réponse pour chaque vide
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
          <div className="space-y-2">
            {questions.map(({ draft, originalIndex }, qIdx) => (
              <div key={originalIndex} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-5 shrink-0 text-center font-medium">
                  {qIdx + 1}.
                </span>
                <Select
                  value={draft.correctAnswer ?? ""}
                  onValueChange={(v) =>
                    onChange(originalIndex, { correctAnswer: v || null })
                  }
                  disabled={isDisabled || wordPool.length === 0}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Bonne réponse…" />
                  </SelectTrigger>
                  <SelectContent>
                    {wordPool.filter(Boolean).map((word, idx) => (
                      <SelectItem key={idx} value={word}>
                        {word}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(originalIndex)}
                  disabled={isDisabled}
                  className="shrink-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
