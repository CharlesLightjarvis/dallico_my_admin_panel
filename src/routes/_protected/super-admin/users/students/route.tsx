import { createFileRoute } from "@tanstack/react-router";
import StudentList from "../../-components/table/student/student-list";

export const Route = createFileRoute("/_protected/super-admin/users/students")({
  component: () => <StudentList />,
  pendingComponent: () => (
    <div className="flex items-center justify-center p-8">
      <div className="text-lg">Chargement des étudiants...</div>
    </div>
  ),
  errorComponent: () => (
    <div className="flex items-center justify-center p-8">
      <div className="text-lg text-red-500">Erreur lors du chargement</div>
    </div>
  ),
});
