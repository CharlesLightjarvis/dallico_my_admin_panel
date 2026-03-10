import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { DataTable } from "@/components/ui/data-table";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogPopup,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/optics/dialog";
import { myGoeyToast } from "@/lib/goey-toast-presets";
import { useModelltest } from "../../../../../../../../../hooks/use-modelltests";
import {
  usePartsByModule,
  useDeletePart,
} from "../../../../../../../../../hooks/use-parts";
import { createColumns } from "../../../../../-components/table/part/columns";
import type { Part } from "../../../../../../../../../types/part";
import { getModuleStyle } from "../../../../../../../../../utils/module-styles";
import type { Module } from "../../../../../../../../../types/module";

export const Route = createFileRoute(
  "/_protected/super-admin/modelltests/$modelltestId/modules/$modelltestModuleId/parts/"
)({
  component: ModulePartsPage,
});

function ModulePartsPage() {
  const { modelltestId, modelltestModuleId } = Route.useParams();
  const navigate = useNavigate();

  const { data: modelltest } = useModelltest(modelltestId);
  const { data: parts = [], isLoading } = usePartsByModule(modelltestModuleId);
  const deletePart = useDeletePart();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  const modelltestModule = modelltest?.modelltest_modules.find(
    (mm) => mm.id === modelltestModuleId
  );

  const handleDelete = (part: Part) => {
    setSelectedPart(part);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPart) return;
    try {
      await deletePart.mutateAsync(selectedPart.id);
      setDeleteDialogOpen(false);
      myGoeyToast("success", "Partie supprimée", {
        description: `La partie "${selectedPart.label ?? selectedPart.instructions}" a été supprimée.`,
      });
    } catch {
      myGoeyToast("error", "Erreur de suppression", {
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
    }
  };

  const columns = createColumns({
    modelltestId,
    modelltestModuleId,
    onDelete: handleDelete,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg">Chargement des parties...</p>
      </div>
    );
  }

  const moduleStyles = modelltestModule
    ? getModuleStyle(
        modelltestModule.module.name as Module["name"],
        modelltestModule.is_active
      )
    : null;

  return (
    <>
      <div className="container mx-auto space-y-6 p-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link
                to="/super-admin/modelltests/$modelltestId"
                params={{ modelltestId }}
              >
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Parties</h1>
            {modelltestModule && moduleStyles && (
              <span
                className={`inline-flex items-center rounded px-2 py-0.5 text-sm font-semibold ${moduleStyles.badge}`}
              >
                {modelltestModule.module.name}
              </span>
            )}
          </div>
          <p className="text-muted-foreground">{modelltest?.title}</p>
        </div>

        <DataTable
          columns={columns}
          data={parts}
          searchFilter={{
            columnIds: ["label"],
            placeholder: "Rechercher par label...",
          }}
          actionButton={{
            label: "Ajouter une partie",
            onClick: () =>
              navigate({
                to: "/super-admin/modelltests/$modelltestId/modules/$modelltestModuleId/parts/new",
                params: { modelltestId, modelltestModuleId },
              }),
          }}
        />
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogPopup>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <DialogTitle>Confirmer la suppression</DialogTitle>
            </div>
            <DialogDescription className="pt-3">
              Êtes-vous sûr de vouloir supprimer la partie{" "}
              <strong>
                "{selectedPart?.label ?? selectedPart?.instructions}"
              </strong>{" "}
              ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deletePart.isPending}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deletePart.isPending}
            >
              {deletePart.isPending ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    </>
  );
}
