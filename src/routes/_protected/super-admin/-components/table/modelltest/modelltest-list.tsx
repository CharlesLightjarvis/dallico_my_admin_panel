import { useState } from "react";
import { createColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { useModelltests } from "../../../../../../../hooks/use-modelltests";
import { MODELLTEST_STATUS } from "../../../../../../../types/modelltest-status";
import { CreateModelltest } from "../../dialog/modelltests/CreateModelltest";
import { UpdateModelltest } from "../../dialog/modelltests/UpdateModelltest";
import { DeleteModelltest } from "../../dialog/modelltests/DeleteModelltest";
import type { Modelltest } from "../../../../../../../types/modelltest";

export default function ModelltestList() {
  const { data: modelltests = [], isLoading } = useModelltests();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedModelltest, setSelectedModelltest] =
    useState<Modelltest | null>(null);

  const handleEdit = (modelltest: Modelltest) => {
    setSelectedModelltest(modelltest);
    setUpdateDialogOpen(true);
  };

  const handleDelete = (modelltest: Modelltest) => {
    setSelectedModelltest(modelltest);
    setDeleteDialogOpen(true);
  };

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Chargement des modelltests...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto space-y-6 p-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des Modelltests
          </h1>
          <p className="text-muted-foreground">
            Créez, modifiez et gérez tous les modelltests en un seul endroit
          </p>
        </div>
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={modelltests}
            searchFilter={{
              columnIds: ["title"],
              placeholder: "Rechercher par titre...",
            }}
            facetedFilters={[
              {
                columnId: "is_active",
                title: "Statut",
                options: MODELLTEST_STATUS,
              },
            ]}
            actionButton={{
              label: "Ajouter un modelltest",
              onClick: () => setCreateDialogOpen(true),
            }}
          />
        </div>
      </div>

      <CreateModelltest
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <UpdateModelltest
        modelltest={selectedModelltest}
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
      />

      <DeleteModelltest
        modelltest={selectedModelltest}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}
