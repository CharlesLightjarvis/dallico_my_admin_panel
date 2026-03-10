import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useModelltest } from "../../../../../../hooks/use-modelltests";
import {
  createColumns,
  type ModuleRow,
} from "../../-components/table/modelltest-module/columns";

export const Route = createFileRoute(
  "/_protected/super-admin/modelltests/$modelltestId/"
)({
  component: ModelltestDetailPage,
});

function ModelltestDetailPage() {
  const { modelltestId } = Route.useParams();
  const { data: modelltest, isLoading } = useModelltest(modelltestId);

  const columns = createColumns({ modelltestId });

  const moduleRows: ModuleRow[] = modelltest
    ? modelltest.modelltest_modules.map((mm) => ({
        modelltestModuleId: mm.id,
        moduleId: mm.module_id,
        name: mm.module.name,
        is_active: mm.is_active,
      }))
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg">Chargement...</p>
      </div>
    );
  }

  if (!modelltest) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-destructive">Modelltest introuvable.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link to="/super-admin/modelltests">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {modelltest.title}
          </h1>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={moduleRows}
        searchFilter={{
          columnIds: ["name"],
          placeholder: "Rechercher un module...",
        }}
      />
    </div>
  );
}
