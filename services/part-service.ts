import { api } from "@/lib/api";
import type { Part, CreatePartPayload, UpdatePartPayload } from "types/part";

export const partService = {
  async getPartsByModule(modelltestModuleId: string): Promise<Part[]> {
    const { data } = await api.get<{ data: Part[] }>(
      `/api/v1/modelltest-modules/${modelltestModuleId}/parts`
    );
    return data.data;
  },

  async getPart(id: string): Promise<Part> {
    const { data } = await api.get<{ data: Part }>(`/api/v1/parts/${id}`);
    return data.data;
  },

  async createPart(payload: CreatePartPayload): Promise<Part> {
    console.log("📦 Payload envoyé:", JSON.stringify(payload, null, 2));
    const { data } = await api.post<{ data: Part }>("/api/v1/parts", payload);
    console.log("✅ Réponse reçue:", JSON.stringify(data.data, null, 2));
    return data.data;
  },

  async updatePart(id: string, payload: UpdatePartPayload): Promise<Part> {
    console.log("📦 Payload envoyé:", JSON.stringify(payload, null, 2));
    const { data } = await api.put<{ data: Part }>(
      `/api/v1/parts/${id}`,
      payload
    );
    return data.data;
  },

  async deletePart(id: string): Promise<void> {
    await api.delete(`/api/v1/parts/${id}`);
  },
};
