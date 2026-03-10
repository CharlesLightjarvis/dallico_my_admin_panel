import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useAssetLoader } from "../../../../hooks/use-asset-loader";
import DallicoLogo from "../../../../assets/dallico.png";

const LOTTIE_SRC =
  "https://lottie.host/ccbc1a3e-9d95-4d90-8a13-320987ad790d/K1uLgLQacY.lottie";

/** 2 assets à surveiller : l'image + l'animation lottie */
const ASSET_COUNT = 2;

interface LoginMediaProps {
  onReady: () => void;
}

/**
 * Panneau droit de la page login.
 * Notifie le parent via `onReady` quand l'image ET le lottie sont chargés.
 */
export function LoginMedia({ onReady }: LoginMediaProps) {
  const { onAssetLoaded } = useAssetLoader({
    count: ASSET_COUNT,
    onReady,
  });

  return (
    <div className="bg-muted relative hidden lg:block">
      <img
        src={DallicoLogo}
        alt=""
        aria-hidden="true"
        onLoad={onAssetLoaded}
        onError={onAssetLoaded}
        className="absolute -top-50 inset-0 h-full w-full object-contain"
      />
      <DotLottieReact
        src={LOTTIE_SRC}
        loop
        autoplay
        onLoad={onAssetLoaded}
        className="w-full mt-72 object-cover"
      />
    </div>
  );
}
