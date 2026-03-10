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
import { useDeleteGroup } from "../../../../../../../hooks/use-groups";
import type { Group } from "../../../../../../../types/group";

interface DeleteGroupProps {
  group: Group | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteGroup({ group, open, onOpenChange }: DeleteGroupProps) {
  const deleteGroup = useDeleteGroup();

  const handleDelete = async () => {
    if (!group) return;

    try {
      await deleteGroup.mutateAsync(group.id);
      onOpenChange(false);
      myGoeyToast("success", "Groupe supprimé", {
        description: `Le groupe "${group.name}" a été supprimé définitivement.`,
      });
    } catch {
      myGoeyToast("error", "Erreur de suppression", {
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
    }
  };

  if (!group) return null;

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
            Êtes-vous sûr de vouloir supprimer le groupe{" "}
            <strong>"{group.name}"</strong> ? Cette action est irréversible et
            supprimera définitivement ce groupe de la base de données.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteGroup.isPending}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteGroup.isPending}
          >
            {deleteGroup.isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
