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

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const textareaClass =
  "border-input dark:bg-input/30 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm resize-none";

interface AnnouncementMatchingCardProps {
  announcements: string[];
  isDisabled: boolean;
  questions: { draft: QuestionDraft; originalIndex: number }[];
  onAddAnnouncement: () => void;
  onUpdateAnnouncement: (idx: number, value: string) => void;
  onRemoveAnnouncement: (idx: number) => void;
  onAddQuestion: () => void;
  onChange: (originalIndex: number, updates: Partial<QuestionDraft>) => void;
  onRemove: (originalIndex: number) => void;
}

export function AnnouncementMatchingCard({
  announcements,
  isDisabled,
  questions,
  onAddAnnouncement,
  onUpdateAnnouncement,
  onRemoveAnnouncement,
  onAddQuestion,
  onChange,
  onRemove,
}: AnnouncementMatchingCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-5">

      {/* ── Annonces ─────────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Annonces
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddAnnouncement}
            disabled={isDisabled}
          >
            <Plus className="size-3.5 mr-1" />
            Ajouter une annonce
          </Button>
        </div>

        {announcements.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">
            Aucune annonce — cliquez sur "Ajouter une annonce".
          </p>
        ) : (
          <div className="space-y-2">
            {announcements.map((ann, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground w-5 shrink-0 text-center">
                  {LETTERS[idx]}
                </span>
                <Input
                  value={ann}
                  onChange={(e) => onUpdateAnnouncement(idx, e.target.value)}
                  placeholder={`Annonce ${LETTERS[idx]}…`}
                  disabled={isDisabled}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveAnnouncement(idx)}
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

      {/* ── Questions ────────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Questions{" "}
            <span className="normal-case font-normal">
              — choisissez la bonne annonce à droite (0/X si aucune)
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
            Ajouter une question
          </Button>
        </div>

        {questions.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">
            Aucune question — cliquez sur "Ajouter une question".
          </p>
        ) : (
          <div className="space-y-2">
            {questions.map(({ draft, originalIndex }, qIdx) => (
              <div key={originalIndex} className="flex items-start gap-2">
                {/* Numéro */}
                <span className="text-xs text-muted-foreground w-5 shrink-0 pt-2.5 text-center font-medium">
                  {qIdx + 1}.
                </span>

                {/* Énoncé */}
                <textarea
                  value={draft.questionText}
                  onChange={(e) =>
                    onChange(originalIndex, { questionText: e.target.value })
                  }
                  rows={2}
                  placeholder="Énoncé de la question…"
                  disabled={isDisabled}
                  className={`${textareaClass} flex-1`}
                />

                {/* Bonne réponse */}
                <Select
                  value={draft.correctAnswer ?? "0X"}
                  onValueChange={(v) =>
                    onChange(originalIndex, {
                      correctAnswer: v === "0X" ? null : v,
                    })
                  }
                  disabled={isDisabled}
                >
                  <SelectTrigger className="w-20 shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0X">0/X</SelectItem>
                    {announcements.map((ann, idx) => (
                      <SelectItem key={idx} value={LETTERS[idx]}>
                        <span className="font-semibold">{LETTERS[idx]}</span>
                        {ann ? (
                          <span className="text-muted-foreground ml-1">
                            — {ann.length > 40 ? ann.slice(0, 40) + "…" : ann}
                          </span>
                        ) : null}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Supprimer */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(originalIndex)}
                  disabled={isDisabled}
                  className="shrink-0 text-destructive hover:text-destructive mt-0.5"
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
