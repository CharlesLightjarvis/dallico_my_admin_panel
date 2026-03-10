import type { MyRouterContext } from "@/routes/__root";
import { useAuthStore } from "../../stores/auth-store";
import type { Role } from "types/role";

export function useRouterContextState(): MyRouterContext {
  const { user, isAuthenticated, logout: logoutFromStore } = useAuthStore();

  const role: Role | null = user?.role || null;
  const isSuperAdmin = role === "super_admin";
  const isAdmin = role === "admin";
  const isTeacher = role === "teacher";
  const isStudent = role === "student";

  const logout = async () => {
    console.log("🚪 Router context logout triggered");
    await logoutFromStore();
    // Navigation will be handled by the calling component
  };

  return {
    role,
    user,
    logout,
    isSuperAdmin,
    isAdmin,
    isTeacher,
    isStudent,
    isAuthenticated,
  };
}
