import { useState, useEffect, useRef, useCallback } from "react";
import { evaluate } from "@mdx-js/mdx";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import type { EvaluateOptions } from "@mdx-js/mdx";
import type { ReactNode } from "react";
import {
  Group as PanelGroup,
  Panel,
  Separator as PanelResizeHandle,
} from "react-resizable-panels";
import { GripVertical, Loader2, AlertCircle, FileText } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ReactMDXContent = () => ReactNode;
type Runtime = Pick<EvaluateOptions, "jsx" | "jsxs" | "Fragment">;

const runtime = { jsx, jsxs, Fragment } as Runtime;

// ─── Plugins (loaded once, cached) ───────────────────────────────────────────

async function getPlugins() {
  const [
    { default: remarkGfm },
    { default: remarkEmoji },
    { default: remarkDirective },
    { default: remarkFrontmatter },
    { default: rehypeSlug },
  ] = await Promise.all([
    import("remark-gfm"),
    import("remark-emoji"),
    import("remark-directive"),
    import("remark-frontmatter"),
    import("rehype-slug"),
  ]);

  return {
    remarkPlugins: [
      remarkGfm,
      remarkEmoji,
      remarkDirective,
      remarkFrontmatter,
    ] as EvaluateOptions["remarkPlugins"],
    rehypePlugins: [rehypeSlug] as EvaluateOptions["rehypePlugins"],
  };
}

// ─── useMDXPreview ────────────────────────────────────────────────────────────

function useMDXPreview(source: string) {
  const [MDXContent, setMDXContent] = useState<ReactMDXContent>(
    () => () => null
  );
  const [error, setError] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pluginsRef = useRef<Awaited<ReturnType<typeof getPlugins>> | null>(
    null
  );

  const compile = useCallback(async (src: string) => {
    if (!src.trim()) {
      setMDXContent(() => () => null);
      setError(null);
      return;
    }
    setIsCompiling(true);
    try {
      if (!pluginsRef.current) pluginsRef.current = await getPlugins();
      const { remarkPlugins, rehypePlugins } = pluginsRef.current;
      const { default: Content } = await evaluate(src, {
        ...runtime,
        remarkPlugins,
        rehypePlugins,
      });
      setMDXContent(() => Content as ReactMDXContent);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsCompiling(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current !== null) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => compile(source), 350);
    return () => {
      if (debounceRef.current !== null) clearTimeout(debounceRef.current);
    };
  }, [source, compile]);

  return { MDXContent, error, isCompiling };
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface MDXEditorProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  minHeight?: number;
  maxHeight?: number;
  placeholder?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MDXEditor({
  value,
  onChange,
  disabled,
  minHeight = 360,
  maxHeight = 640,
  placeholder = "Écrivez votre MDX ici...",
}: MDXEditorProps) {
  const { MDXContent, error, isCompiling } = useMDXPreview(value);

  return (
    <div className="flex flex-col gap-1">
      <PanelGroup
        orientation="horizontal"
        className="w-full border border-border rounded-xl overflow-hidden shadow-sm"
        style={{ minHeight, maxHeight }}
      >
        {/* ── LEFT: Editor ── */}
        <Panel defaultSize={50} minSize={20}>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            spellCheck={false}
            className="block w-full h-full resize-none border-0 outline-none bg-background text-foreground placeholder:text-muted-foreground disabled:opacity-50"
            style={{
              padding: "14px 16px",
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
              lineHeight: 1.75,
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              boxSizing: "border-box",
            }}
          />
        </Panel>

        {/* ── HANDLE ── */}
        <PanelResizeHandle
          className="flex items-center justify-center shrink-0 bg-border cursor-col-resize"
          style={{ width: 5 }}
        >
          <GripVertical size={11} className="text-muted-foreground" />
        </PanelResizeHandle>

        {/* ── RIGHT: Preview — native HTML via Tailwind Typography ── */}
        <Panel defaultSize={50} minSize={20}>
          <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted border-b border-border shrink-0 min-h-9">
              <FileText size={12} className="text-muted-foreground" />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.06em]">
                Aperçu
              </span>
              {isCompiling && (
                <Loader2
                  size={12}
                  className="text-primary animate-spin ml-0.5"
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 w-full box-border">
              {error ? (
                <div className="flex gap-2.5 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <pre className="m-0 whitespace-pre-wrap font-mono text-xs leading-relaxed">
                    {error}
                  </pre>
                </div>
              ) : value.trim() ? (
                <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:no-underline prose-headings:border-b-0">
                  <MDXContent />
                </div>
              ) : (
                <p className="text-muted-foreground italic text-sm m-0">
                  L'aperçu s'affichera ici...
                </p>
              )}
            </div>
          </div>
        </Panel>
      </PanelGroup>

      {/* Syntax hint */}
      <p className="text-[11px] text-muted-foreground m-0">
        {[
          "**gras**",
          "*italique*",
          "`code`",
          "```js",
          "- liste",
          "1. liste",
          "> citation",
          "# H1",
        ].map((s) => (
          <code
            key={s}
            className="bg-muted text-muted-foreground px-1.5 py-px rounded text-[10px] mr-1 font-mono"
          >
            {s}
          </code>
        ))}
      </p>
    </div>
  );
}
