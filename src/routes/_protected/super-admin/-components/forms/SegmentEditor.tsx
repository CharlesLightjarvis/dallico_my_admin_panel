import { useRef } from "react";
import { Plus, Type } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Éditeur de contenu segmenté pour les exercices gap fill (Teil 3 & 4).
 *
 * Format stocké en DB : JSON string, ex:
 *   [{"t":"Du möchtest "},{"gap":1},{" t":" einladen aber "},{"gap":2},{"t":" Angst..."}]
 *
 * Format d'édition (textarea) :
 *   "Du möchtest {1} einladen aber {2} Angst..."
 *
 * Le bouton "Insérer un vide" insère {N} à la position du curseur.
 */

type Segment = { t: string } | { gap: number };

// ─── Parsers ──────────────────────────────────────────────────────────────────

function rawToSegments(raw: string): Segment[] {
  const parts = raw.split(/\{(\d+)\}/);
  const segments: Segment[] = [];
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      if (parts[i]) segments.push({ t: parts[i] });
    } else {
      segments.push({ gap: parseInt(parts[i], 10) });
    }
  }
  return segments;
}

function segmentsToRaw(segments: Segment[]): string {
  return segments.map((s) => ("gap" in s ? `{${s.gap}}` : s.t)).join("");
}

function jsonToRaw(json: string | null): string {
  if (!json) return "";
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) return segmentsToRaw(parsed);
    return json; // fallback : texte brut
  } catch {
    return json;
  }
}

function rawToJson(raw: string): string | null {
  const segments = rawToSegments(raw);
  if (segments.length === 0) return null;
  return JSON.stringify(segments);
}

function nextGapNum(raw: string): number {
  const matches = [...raw.matchAll(/\{(\d+)\}/g)];
  if (matches.length === 0) return 1;
  return Math.max(...matches.map((m) => parseInt(m[1], 10))) + 1;
}

// ─── Composant ────────────────────────────────────────────────────────────────

const textareaClass =
  "border-input dark:bg-input/30 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm resize-none";

interface SegmentEditorProps {
  value: string | null; // JSON string (format DB)
  onChange: (value: string | null) => void;
  disabled?: boolean;
}

export function SegmentEditor({ value, onChange, disabled }: SegmentEditorProps) {
  const raw = jsonToRaw(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(rawToJson(e.target.value));
  };

  const insertGap = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart ?? raw.length;
    const n = nextGapNum(raw);
    const token = `{${n}}`;
    const newRaw = raw.slice(0, pos) + token + raw.slice(pos);
    onChange(rawToJson(newRaw));
    // Replace le curseur après le token inséré
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(pos + token.length, pos + token.length);
    });
  };

  // Preview : rend le raw comme le verrait l'étudiant
  const segments = rawToSegments(raw);

  return (
    <div className="space-y-3">
      {/* Aperçu */}
      <div className="bg-muted/50 rounded-md p-3 leading-8 text-sm text-foreground min-h-10">
        {segments.length === 0 ? (
          <span className="text-muted-foreground italic">
            Aperçu — écrivez le texte puis insérez des vides avec le bouton
          </span>
        ) : (
          segments.map((seg, i) =>
            "gap" in seg ? (
              <span
                key={i}
                className="inline-flex items-center justify-center bg-primary/10 border border-primary/40 rounded px-2 py-0.5 mx-0.5 text-primary font-semibold text-xs"
              >
                ({seg.gap})
              </span>
            ) : (
              <span key={i}>{seg.t}</span>
            ),
          )
        )}
      </div>

      {/* Textarea + bouton */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Écrivez le texte — les vides apparaissent comme{" "}
            <code className="bg-muted px-1 rounded">{"{1}"}</code>,{" "}
            <code className="bg-muted px-1 rounded">{"{2}"}</code>…
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={insertGap}
            disabled={disabled}
          >
            <Plus className="size-3.5 mr-1" />
            Insérer un vide
          </Button>
        </div>

        <textarea
          ref={textareaRef}
          value={raw}
          onChange={handleChange}
          rows={5}
          placeholder={"Du möchtest {1} einladen, aber ich habe {2} Angst..."}
          disabled={disabled}
          className={textareaClass}
        />
      </div>
    </div>
  );
}
