import { CheckCircle2, XCircle, ShieldBan } from 'lucide-react'

export const USER_STATUS = [
  { label: 'Actif', value: 'active', icon: CheckCircle2 },
  { label: 'Inactif', value: 'inactive', icon: XCircle },
  { label: 'Restreint', value: 'restricted', icon: ShieldBan },
] as const

export type UserStatus = (typeof USER_STATUS)[number]['value']
