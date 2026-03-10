import { createFileRoute } from "@tanstack/react-router";
import GroupList from "../-components/table/group/group-list";

export const Route = createFileRoute("/_protected/super-admin/groups/")({
  component: () => <GroupList />,
});
