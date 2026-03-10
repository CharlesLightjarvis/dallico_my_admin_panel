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
import type { Group } from "../../../../../../../types/group";
import { GROUP_STATUS } from "../../../../../../../types/group-status";
import { formatDate } from "../../../../../../../utils/format-date";
import { getGroupStatusStyle } from "../../../../../../../utils/status-styles";
import { getLevelBadgeStyle } from "../../../../../../../utils/level-styles";

interface ColumnsProps {
  onEdit: (group: Group) => void;
  onDelete: (group: Group) => void;
}

export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<Group>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
  },
  {
    id: "exam",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Examen" />
    ),
    cell: ({ row }) => {
      const exam = row.original.exam;
      if (!exam)
        return <span className="text-muted-foreground text-xs">—</span>;
      return <span className="text-sm">{exam.name}</span>;
    },
  },
  {
    id: "level",
    accessorFn: (row) => row.level?.name ?? "",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Niveau" />
    ),
    cell: ({ row }) => {
      const level = row.original.level;
      if (!level)
        return <span className="text-muted-foreground text-xs">—</span>;
      const styles = getLevelBadgeStyle(level.name, true);
      return (
        <span
          className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold ${styles.badge}`}
        >
          {level.name}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      const code = row.getValue(id) as string;
      return value.includes(code);
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
      const status = GROUP_STATUS.find((s) => s.value === statusValue);
      if (!status) return null;
      const styles = getGroupStatusStyle(statusValue);
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
      const group = row.original;
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
            <DropdownMenuItem onClick={() => onEdit(group)}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(group)}
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const columns: ColumnDef<Group>[] = createColumns({
  onEdit: () => {},
  onDelete: () => {},
});
