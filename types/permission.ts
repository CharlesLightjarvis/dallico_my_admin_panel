export const PERMISSIONS = [
    // Centers
    'view_centers',
    'create_centers',
    'update_centers',
  
    // Users
    'view_users',
    'create_users',
    'update_users',
    'delete_users',
  
    // Levels
    'view_levels',
    'create_levels',
    'update_levels',
    'delete_levels',
  
    // Sub-levels
    'view_sub_levels',
    'create_sub_levels',
    'update_sub_levels',
    'delete_sub_levels',
  
    // Groups
    'view_groups',
    'create_groups',
    'update_groups',
    'delete_groups',
  
    // Enrollments
    'view_enrollments',
    'create_enrollments',
    'update_enrollments',
    'delete_enrollments',
  
    // Payments
    'view_payments',
    'create_payments',
    'update_payments',
  
    // Schedules
    'view_schedules',
    'create_schedules',
    'update_schedules',
    'delete_schedules',
  
    // Sessions
    'view_sessions',
    'create_sessions',
    'update_sessions',
    'delete_sessions',
  ] as const;
  
  export type Permission = (typeof PERMISSIONS)[number];