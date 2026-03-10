import { api } from "@/lib/api";
import type { Module } from "../types/module";

export const moduleService = {
  async getModules(): Promise<Module[]> {
    const { data } = await api.get<{ data: Module[] }>("/api/v1/modules");
    return data.data; // ← unwrap le data de Laravel Resource
  },
};
