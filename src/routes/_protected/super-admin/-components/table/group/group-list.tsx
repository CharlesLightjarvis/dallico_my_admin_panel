import { useState } from "react";
import { createColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { useGroups } from "../../../../../../../hooks/use-groups";
import { useLevels } from "../../../../../../../hooks/use-levels";
import { GROUP_STATUS } from "../../../../../../../types/group-status";
import { CreateGroup } from "../../dialog/groups/CreateGroup";
import { UpdateGroup } from "../../dialog/groups/UpdateGroup";
import { DeleteGroup } from "../../dialog/groups/DeleteGroup";
import type { Group } from "../../../../../../../types/group";

export default function GroupList() {
  const { data: groups = [], isLoading } = useGroups();
  const { data: allLevels = [] } = useLevels();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const handleEdit = (group: Group) => {
    setSelectedGroup(group);
    setUpdateDialogOpen(true);
  };

  const handleDelete = (group: Group) => {
    setSelectedGroup(group);
    setDeleteDialogOpen(true);
  };

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const levelOptions = allLevels.map((l) => ({
    value: l.name,
    label: l.name,
  }));

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Chargement des groupes...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto space-y-6 p-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des groupes
          </h1>
          <p className="text-muted-foreground">
            Créez, modifiez et gérez tous les groupes en un seul endroit
          </p>
        </div>
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={groups}
            searchFilter={{
              columnIds: ["name"],
              placeholder: "Rechercher par nom...",
            }}
            facetedFilters={[
              {
                columnId: "is_active",
                title: "Statut",
                options: GROUP_STATUS,
              },
              {
                columnId: "level",
                title: "Niveau",
                options: levelOptions,
              },
            ]}
            actionButton={{
              label: "Ajouter un groupe",
              onClick: () => setCreateDialogOpen(true),
            }}
          />
        </div>
      </div>

      <CreateGroup open={createDialogOpen} onOpenChange={setCreateDialogOpen} />

      <UpdateGroup
        group={selectedGroup}
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
      />

      <DeleteGroup
        group={selectedGroup}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}
