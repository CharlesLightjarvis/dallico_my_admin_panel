import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import "../styles.css";
import type { Role } from "../../types/role";
import type { User } from "../../types/user";
import { ThemeProvider } from "@/components/theme-provider";
import { RouterProgressOverlay } from "@/components/ui/router-progress-overlay";
import { GoeyToaster } from "@/components/ui/goey-toaster";

export type MyRouterContext = {
  role: Role | null;
  user: User | null;
  logout: () => void;
  isSuperAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProgressOverlay />
      <Outlet />
      <GoeyToaster position="top-center" />
    </ThemeProvider>
  );
}
