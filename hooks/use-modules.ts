import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../config/query-keys";
import { moduleService } from "../services/module-service";

export function useModules() {
  return useQuery({
    queryKey: queryKeys.modules.lists(),
    queryFn: () => moduleService.getModules(),
  });
}
