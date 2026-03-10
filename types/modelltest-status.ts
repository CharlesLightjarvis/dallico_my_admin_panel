import { CheckCircle2, XCircle } from "lucide-react";

export const MODELLTEST_STATUS = [
  { label: "Actif", value: "active", icon: CheckCircle2 },
  { label: "Inactif", value: "inactive", icon: XCircle },
] as const;

export type ModelltestStatus = (typeof MODELLTEST_STATUS)[number]["value"];
