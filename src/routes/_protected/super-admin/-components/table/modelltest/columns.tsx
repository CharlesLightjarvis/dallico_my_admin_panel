import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Link } from "@tanstack/react-router";
import type { Modelltest } from "../../../../../../../types/modelltest";
import { MODELLTEST_STATUS } from "../../../../../../../types/modelltest-status";
import { formatDate } from "../../../../../../../utils/format-date";
import { getModelltestStatusStyle } from "../../../../../../../utils/status-styles";
import { getModuleStyle } from "../../../../../../../utils/module-styles";

interface ColumnsProps {
  onEdit: (modelltest: Modelltest) => void;
  onDelete: (modelltest: Modelltest) => void;
}

export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<Modelltest>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Titre" />
    ),
  },
  {
    id: "group",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Groupe" />
    ),
    cell: ({ row }) => {
      const group = row.original.group;
      if (!group)
        return <span className="text-muted-foreground text-xs">—</span>;
      return <span className="text-sm">{group.name}</span>;
    },
  },
  {
    id: "modules",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Modules" />
    ),
    cell: ({ row }) => {
      const modelltest_modules = row.original.modelltest_modules ?? [];
      if (!modelltest_modules.length)
        return <span className="text-muted-foreground text-xs">—</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {modelltest_modules.map((mm) => {
            const styles = getModuleStyle(mm.module.name, mm.is_active);
            return (
              <span
                key={mm.id}
                className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold ${styles.badge}`}
              >
                {mm.module.name}
              </span>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Statut" />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean;
      const statusValue = isActive ? "active" : "inactive";
      const status = MODELLTEST_STATUS.find((s) => s.value === statusValue);
      if (!status) return null;
      const styles = getModelltestStatusStyle(statusValue);
      return (
        <div
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles.badge}`}
        >
          <status.icon className={`size-3.5 ${styles.icon}`} />
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const isActive = row.getValue(id) as boolean;
      return value.includes(isActive ? "active" : "inactive");
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Créé le" />
    ),
    cell: ({ row }) => formatDate(row.getValue("created_at")),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const modelltest = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                to="/super-admin/modelltests/$modelltestId"
                params={{ modelltestId: modelltest.id }}
              >
                Voir les modules
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(modelltest)}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(modelltest)}
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const columns: ColumnDef<Modelltest>[] = createColumns({
  onEdit: () => {},
  onDelete: () => {},
});
