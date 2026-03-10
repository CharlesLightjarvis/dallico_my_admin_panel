import { useState } from "react";
import { createColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { useExams } from "../../../../../../../hooks/use-exams";
import { EXAM_STATUS } from "../../../../../../../types/exam-status";
import { CreateExam } from "../../dialog/exams/CreateExam";
import { UpdateExam } from "../../dialog/exams/UpdateExam";
import { DeleteExam } from "../../dialog/exams/DeleteExam";
import type { Exam } from "../../../../../../../types/exam";

export default function ExamList() {
  const { data: exams = [], isLoading } = useExams();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const handleEdit = (exam: Exam) => {
    setSelectedExam(exam);
    setUpdateDialogOpen(true);
  };

  const handleDelete = (exam: Exam) => {
    setSelectedExam(exam);
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
          <p className="text-lg">Chargement des examens...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto space-y-6 p-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des examens
          </h1>
          <p className="text-muted-foreground">
            Créez, modifiez et gérez tous les examens en un seul endroit
          </p>
        </div>
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={exams}
            searchFilter={{
              columnIds: ["name"],
              placeholder: "Rechercher par nom...",
            }}
            facetedFilters={[
              {
                columnId: "is_active",
                title: "Statut",
                options: EXAM_STATUS,
              },
            ]}
            actionButton={{
              label: "Ajouter un examen",
              onClick: () => setCreateDialogOpen(true),
            }}
          />
        </div>
      </div>

      <CreateExam open={createDialogOpen} onOpenChange={setCreateDialogOpen} />

      <UpdateExam
        exam={selectedExam}
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
      />

      <DeleteExam
        exam={selectedExam}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}
