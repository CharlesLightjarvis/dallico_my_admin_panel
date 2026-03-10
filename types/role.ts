import { PERMISSIONS, type Permission } from "./permission";

export const ROLES = ['super_admin', 'admin', 'teacher', 'student' ] as const;

export type Role = (typeof ROLES)[ number ];

// Permissions par rôle
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    super_admin: [...PERMISSIONS], // tous les droits
    admin: [
      'view_centers', 'create_centers', 'update_centers',
      'view_users', 'create_users', 'update_users', 'delete_users',
      'view_levels', 'create_levels', 'update_levels', 'delete_levels',
      'view_sub_levels', 'create_sub_levels', 'update_sub_levels', 'delete_sub_levels',
      'view_groups', 'create_groups', 'update_groups', 'delete_groups',
      'view_enrollments', 'create_enrollments', 'update_enrollments', 'delete_enrollments',
      'view_payments', 'create_payments', 'update_payments',
      'view_schedules', 'create_schedules', 'update_schedules', 'delete_schedules',
      'view_sessions', 'create_sessions', 'update_sessions', 'delete_sessions',
    ],
    teacher: [
      'view_groups', 'view_enrollments', 'view_schedules', 'view_sessions',
    ],
    student: [
      'view_groups', 'view_enrollments', 'view_payments', 'view_schedules',
    ],
  };