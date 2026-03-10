const activeLevelStyles: Record<string, { badge: string }> = {
  A1: { badge: "bg-sky-500/10 text-sky-600 border border-sky-500/20" },
  A2: { badge: "bg-blue-500/10 text-blue-600 border border-blue-500/20" },
  B1: { badge: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" },
  B2: { badge: "bg-green-500/10 text-green-600 border border-green-500/20" },
  C1: { badge: "bg-amber-500/10 text-amber-600 border border-amber-500/20" },
  C2: { badge: "bg-orange-500/10 text-orange-600 border border-orange-500/20" },
};

const inactiveLevelStyle = {
  badge: "bg-gray-500/10 text-gray-400 border border-gray-500/20 opacity-60",
};

export function getLevelBadgeStyle(code: string, isActive: boolean) {
  if (!isActive) return inactiveLevelStyle;
  return (
    activeLevelStyles[code] ?? {
      badge: "bg-gray-500/10 text-gray-500 border border-gray-500/20",
    }
  );
}
