import type { ModuleName } from "../types/module";

const moduleStyles: Record<ModuleName, { badge: string; label: string }> = {
  Lesen: {
    badge: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
    label: "Lesen",
  },
  Schreiben: {
    badge: "bg-violet-500/10 text-violet-600 border border-violet-500/20",
    label: "Schreiben",
  },
  Sprechen: {
    badge: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
    label: "Sprechen",
  },
  Hören: {
    badge: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
    label: "Hören",
  },
};

const inactiveModuleStyle = {
  badge: "bg-gray-500/10 text-gray-400 border border-gray-500/20 opacity-60",
  label: "",
};

export function getModuleStyle(name: ModuleName, isActive: boolean) {
  if (!isActive) return inactiveModuleStyle;
  return moduleStyles[name] ?? {
    badge: "bg-gray-500/10 text-gray-500 border border-gray-500/20",
    label: name,
  };
}
