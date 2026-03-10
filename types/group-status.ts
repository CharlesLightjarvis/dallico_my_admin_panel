import { CheckCircle2, XCircle } from "lucide-react";

export const GROUP_STATUS = [
  { label: "Actif", value: "active", icon: CheckCircle2 },
  { label: "Inactif", value: "inactive", icon: XCircle },
] as const;

export type GroupStatus = (typeof GROUP_STATUS)[number]["value"];
