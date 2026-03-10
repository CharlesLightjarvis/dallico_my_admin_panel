import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageLoader } from "@/components/ui/page-loader";
import { useAppStore } from "../../../stores/app-store";

/**
 * Délai pour les navigations SUIVANTES uniquement.
 * Evite le flash sur les transitions rapides (< 200ms).
 */
const SUBSEQUENT_DELAY_MS = 200;

/**
 * Overlay global lié au router TanStack.
 *
 * - Chargement initial : visible immédiatement (useState(isLoading)) pour
 *   s'enchaîner sans gap avec le PageLoader de App.
 *   Quand le router devient idle → appelle setBootstrapped() → le PageLoader
 *   de App (main.tsx) peut alors se retirer.
 *
 * - Navigations suivantes : délai de 200ms pour éviter les flashes rapides.
 */
export function RouterProgressOverlay() {
  const isLoading = useRouterState({ select: (s) => s.isLoading });
  const setBootstrapped = useAppStore((s) => s.setBootstrapped);

  // Visible immédiatement si le router charge au mount (chargement initial)
  const [isVisible, setIsVisible] = useState(isLoading);

  useEffect(() => {
    if (!isLoading) {
      setIsVisible(false);
      // Signale que l'app est pleinement bootstrappée (fetchUser + router idle)
      setBootstrapped();
      return;
    }

    const timer = setTimeout(() => setIsVisible(true), SUBSEQUENT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isLoading, setBootstrapped]);

  return <PageLoader visible={isVisible} />;
}
