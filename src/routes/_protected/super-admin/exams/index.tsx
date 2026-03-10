import { createFileRoute } from "@tanstack/react-router";
import ExamList from "../-components/table/exam/exam-list";

export const Route = createFileRoute("/_protected/super-admin/exams/")({
  component: () => <ExamList />,
});
