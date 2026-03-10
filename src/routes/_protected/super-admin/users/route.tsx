import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/super-admin/users")({
  component: () => <Outlet />,
});
