import { createFileRoute } from "@tanstack/react-router";
import ModelltestList from "../-components/table/modelltest/modelltest-list";

export const Route = createFileRoute("/_protected/super-admin/modelltests/")({
  component: () => <ModelltestList />,
});
