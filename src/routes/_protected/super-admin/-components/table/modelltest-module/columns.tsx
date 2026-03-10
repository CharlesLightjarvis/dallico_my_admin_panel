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
import { getModuleStyle } from "../../../../../../../utils/module-styles";
import type { Module } from "../../../../../../../types/module";

export interface ModuleRow {
  modelltestModuleId: string;
  moduleId: string;
  name: string;
  is_active: boolean;
}

interface ColumnsProps {
  modelltestId: string;
}

export const createColumns = ({
  modelltestId,
}: ColumnsProps): ColumnDef<ModuleRow>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Module" />
    ),
    cell: ({ row }) => {
      const name = row.original.name as Module["name"];
      const styles = getModuleStyle(name, row.original.is_active);
      return (
        <span
          className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold ${styles.badge}`}
        >
          {name}
        </span>
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
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {isActive ? "Actif" : "Inactif"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { modelltestModuleId } = row.original;
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
                to="/super-admin/modelltests/$modelltestId/modules/$modelltestModuleId/parts"
                params={{ modelltestId, modelltestModuleId }}
              >
                Voir les parties
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
