export interface ExamLevel {
  id: string;
  level_id: string;
  is_active: boolean;
  level: {
    id: string;
    name: string;
    code: string;
    order: number;
  };
}
