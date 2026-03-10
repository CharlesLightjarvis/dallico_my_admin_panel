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
import type { Exam } from "../../../../../../../types/exam";
import { EXAM_STATUS } from "../../../../../../../types/exam-status";
import { formatDate } from "../../../../../../../utils/format-date";
import { getExamStatusStyle } from "../../../../../../../utils/status-styles";
import { getLevelBadgeStyle } from "../../../../../../../utils/level-styles";

interface ColumnsProps {
  onEdit: (exam: Exam) => void;
  onDelete: (exam: Exam) => void;
}

export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<Exam>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate">
        {row.getValue("description")}
      </div>
    ),
  },
  {
    id: "levels",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Niveaux" />
    ),
    cell: ({ row }) => {
      const exam_levels = row.original.exam_levels ?? [];

      if (!exam_levels.length) {
        return <span className="text-muted-foreground text-xs">—</span>;
      }

      return (
        <div className="flex flex-wrap gap-1">
          {exam_levels.map((exam_level) => {
            const styles = getLevelBadgeStyle(
              exam_level.level.code,
              exam_level.is_active
            );
            return (
              <span
                key={exam_level.level.id}
                className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold ${styles.badge}`}
              >
                {exam_level.level.code}
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
      const status = EXAM_STATUS.find((s) => s.value === statusValue);
      if (!status) return null;
      const styles = getExamStatusStyle(statusValue);
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
      const exam = row.original;
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
            <DropdownMenuItem onClick={() => onEdit(exam)}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(exam)}
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const columns: ColumnDef<Exam>[] = createColumns({
  onEdit: () => {},
  onDelete: () => {},
});
