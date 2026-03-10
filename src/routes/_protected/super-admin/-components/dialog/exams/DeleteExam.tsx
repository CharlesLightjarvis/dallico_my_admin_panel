import { AlertTriangle } from "lucide-react";
import { myGoeyToast } from "@/lib/goey-toast-presets";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogPopup,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/optics/dialog";
import { useDeleteExam } from "../../../../../../../hooks/use-exams";
import type { Exam } from "../../../../../../../types/exam";

interface DeleteExamProps {
  exam: Exam | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteExam({ exam, open, onOpenChange }: DeleteExamProps) {
  const deleteExam = useDeleteExam();

  const handleDelete = async () => {
    if (!exam) return;

    try {
      await deleteExam.mutateAsync(exam.id);
      onOpenChange(false);
      myGoeyToast("success", "Examen supprimé", {
        description: `L'examen "${exam.name}" a été supprimé définitivement.`,
      });
    } catch {
      myGoeyToast("error", "Erreur de suppression", {
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
    }
  };

  if (!exam) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </div>
          <DialogDescription className="pt-3">
            Êtes-vous sûr de vouloir supprimer l'examen{" "}
            <strong>"{exam.name}"</strong> ? Cette action est irréversible et
            supprimera définitivement cet examen de la base de données.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteExam.isPending}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteExam.isPending}
          >
            {deleteExam.isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
