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
import type { Part } from "../../../../../../../types/part";
import { formatDate } from "../../../../../../../utils/format-date";

interface ColumnsProps {
  modelltestId: string;
  modelltestModuleId: string;
  onDelete: (part: Part) => void;
}

export const createColumns = ({
  modelltestId,
  modelltestModuleId,
  onDelete,
}: ColumnsProps): ColumnDef<Part>[] => [
  {
    accessorKey: "label",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Titre" />
    ),
  },
  {
    accessorKey: "question_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type de partie" />
    ),
  },
  {
    accessorKey: "order",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ordre" />
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.getValue("order")}</span>
    ),
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
      const part = row.original;
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
                to="/super-admin/modelltests/$modelltestId/modules/$modelltestModuleId/parts/$partId/edit"
                params={{ modelltestId, modelltestModuleId, partId: part.id }}
              >
                Modifier
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(part)}
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
