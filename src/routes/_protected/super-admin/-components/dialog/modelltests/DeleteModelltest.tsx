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
import { useDeleteModelltest } from "../../../../../../../hooks/use-modelltests";
import type { Modelltest } from "../../../../../../../types/modelltest";

interface DeleteModelltestProps {
  modelltest: Modelltest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteModelltest({
  modelltest,
  open,
  onOpenChange,
}: DeleteModelltestProps) {
  const deleteModelltest = useDeleteModelltest();

  const handleDelete = async () => {
    if (!modelltest) return;
    try {
      await deleteModelltest.mutateAsync(modelltest.id);
      onOpenChange(false);
      myGoeyToast("success", "Modelltest supprimé", {
        description: `Le modelltest "${modelltest.title}" a été supprimé définitivement.`,
      });
    } catch {
      myGoeyToast("error", "Erreur de suppression", {
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
    }
  };

  if (!modelltest) return null;

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
            Êtes-vous sûr de vouloir supprimer le modelltest{" "}
            <strong>"{modelltest.title}"</strong> ? Cette action est
            irréversible et supprimera également tous les modules associés.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteModelltest.isPending}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteModelltest.isPending}
          >
            {deleteModelltest.isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
