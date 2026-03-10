import { api } from "@/lib/api";
import type {
  Group,
  CreateGroupPayload,
  UpdateGroupPayload,
} from "types/group";

export const groupService = {
  async getGroups(): Promise<Group[]> {
    const { data } = await api.get<{ data: Group[] }>("/api/v1/groups");
    console.log(data.data);
    return data.data;
  },

  async getGroup(id: string): Promise<Group> {
    const { data } = await api.get<{ data: Group }>(`/api/v1/groups/${id}`);
    return data.data;
  },

  async createGroup(payload: CreateGroupPayload): Promise<Group> {
    const { data } = await api.post<{ data: Group }>("/api/v1/groups", payload);
    return data.data;
  },

  async updateGroup(id: string, payload: UpdateGroupPayload): Promise<Group> {
    const { data } = await api.put<{ data: Group }>(
      `/api/v1/groups/${id}`,
      payload
    );
    return data.data;
  },

  async deleteGroup(id: string): Promise<void> {
    await api.delete(`/api/v1/groups/${id}`);
  },
};
