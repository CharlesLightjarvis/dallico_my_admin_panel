import { useCallback, useEffect, useRef, useState } from "react";

interface UseAssetLoaderOptions {
  /** Nombre d'assets à attendre avant de considérer la page prête */
  count: number;
  /** Délai max avant de forcer l'affichage (filet de sécurité réseau lent / mobile) */
  timeoutMs?: number;
  /** Callback appelé quand tous les assets sont prêts OU que le timeout expire */
  onReady?: () => void;
}

/**
 * Suit le chargement de N assets (image, lottie, etc.).
 * Appelle `onReady` quand tous ont chargé ou après `timeoutMs`.
 *
 * Usage:
 *   const { onAssetLoaded } = useAssetLoader({ count: 2, onReady });
 *   <img onLoad={onAssetLoaded} onError={onAssetLoaded} />
 *   <DotLottieReact onLoad={onAssetLoaded} />
 */
export function useAssetLoader({
  count,
  timeoutMs = 1500,
  onReady,
}: UseAssetLoaderOptions) {
  const [isReady, setIsReady] = useState(false);
  const loadedCount = useRef(0);
  const hasResolved = useRef(false);

  const resolve = useCallback(() => {
    if (hasResolved.current) return;
    hasResolved.current = true;
    setIsReady(true);
    onReady?.();
  }, [onReady]);

  // Filet de sécurité : timeout fallback si un asset ne charge jamais
  useEffect(() => {
    const timer = setTimeout(resolve, timeoutMs);
    return () => clearTimeout(timer);
  }, [resolve, timeoutMs]);

  const onAssetLoaded = useCallback(() => {
    loadedCount.current += 1;
    if (loadedCount.current >= count) {
      resolve();
    }
  }, [count, resolve]);

  return { isReady, onAssetLoaded };
}
