import { CheckCircle2, XCircle } from "lucide-react";

export const EXAM_STATUS = [
  { label: "Actif", value: "active", icon: CheckCircle2 },
  { label: "Inactif", value: "inactive", icon: XCircle },
] as const;

export type ExamStatus = (typeof EXAM_STATUS)[number]["value"];
