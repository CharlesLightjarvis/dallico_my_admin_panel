import { cn } from "@/lib/utils";

interface PageLoaderProps {
  visible: boolean;
}

/**
 * Overlay pleine page qui bloque le contenu pendant le chargement des assets.
 * Disparaît en fade-out une fois `visible` passe à false.
 */
export function PageLoader({ visible }: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-label="Chargement en cours"
      aria-hidden={!visible}
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-background",
        "transition-opacity duration-500 ease-in-out",
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
    >
      <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
    </div>
  );
}
