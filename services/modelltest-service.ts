import { api } from "@/lib/api";
import type {
  Modelltest,
  CreateModelltestPayload,
  UpdateModelltestPayload,
} from "types/modelltest";

export const modelltestService = {
  async getModelltests(): Promise<Modelltest[]> {
    const { data } = await api.get<{ data: Modelltest[] }>(
      "/api/v1/modelltests"
    );
    return data.data;
  },

  async getModelltest(id: string): Promise<Modelltest> {
    const { data } = await api.get<{ data: Modelltest }>(
      `/api/v1/modelltests/${id}`
    );
    return data.data;
  },

  async createModelltest(
    payload: CreateModelltestPayload
  ): Promise<Modelltest> {
    const { data } = await api.post<{ data: Modelltest }>(
      "/api/v1/modelltests",
      payload
    );
    return data.data;
  },

  async updateModelltest(
    id: string,
    payload: UpdateModelltestPayload
  ): Promise<Modelltest> {
    const { data } = await api.put<{ data: Modelltest }>(
      `/api/v1/modelltests/${id}`,
      payload
    );
    return data.data;
  },

  async deleteModelltest(id: string): Promise<void> {
    await api.delete(`/api/v1/modelltests/${id}`);
  },
};
