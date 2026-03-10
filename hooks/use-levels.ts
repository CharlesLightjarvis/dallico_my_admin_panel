import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../config/query-keys";
import { levelService } from "../services/level-service";

export function useLevels() {
  return useQuery({
    queryKey: queryKeys.levels.lists(),
    queryFn: () => levelService.getLevels(),
  });
}
