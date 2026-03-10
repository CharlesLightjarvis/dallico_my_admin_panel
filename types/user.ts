import type { Permission } from "./permission";
import type { Role } from "./role";
import type { UserStatus } from "./user-status";

export interface User {
  id: string; // UUID
  first_name: string | null; // nullable en base
  last_name: string | null;
  email: string;
  profile_url: string | null;
  status: UserStatus | null;
  role: Role | null; // super_admin, admin, teacher, student
  permissions: Permission[]; // array de noms de permissions
  createdAt: string;
  updatedAt: string;
}
