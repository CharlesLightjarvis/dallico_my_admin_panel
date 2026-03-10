import { api } from "@/lib/api";
import type { Level } from "./../types/level";

export const levelService = {
  async getLevels(): Promise<Level[]> {
    const { data } = await api.get<{ data: Level[] }>("/api/v1/levels");
    return data.data; // ← unwrap le data de Laravel Resource
  },
};
