import {
  SignalLow,
  SignalMedium,
  SignalHigh,
  Signal,
  GraduationCap,
  Award,
} from "lucide-react";

export const LEVEL_LABELS = [
  { label: "A1", value: "A1", icon: SignalLow },
  { label: "A2", value: "A2", icon: SignalMedium },
  { label: "B1", value: "B1", icon: SignalHigh },
  { label: "B2", value: "B2", icon: Signal },
  { label: "C1", value: "C1", icon: GraduationCap },
  { label: "C2", value: "C2", icon: Award },
] as const;

export type LevelLabel = (typeof LEVEL_LABELS)[number]["value"];
