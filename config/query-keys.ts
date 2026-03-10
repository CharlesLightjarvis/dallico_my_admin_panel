export const queryKeys = {
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    detail: (id: string) => [...queryKeys.users.all, id] as const,
  },
  exams: {
    all: ["exams"] as const,
    lists: () => [...queryKeys.exams.all, "list"] as const,
    detail: (id: string) => [...queryKeys.exams.all, id] as const,
  },
  levels: {
    all: ["levels"] as const,
    lists: () => [...queryKeys.levels.all, "list"] as const,
    detail: (id: string) => [...queryKeys.levels.all, id] as const,
  },
  groups: {
    all: ["groups"] as const,
    lists: () => [...queryKeys.groups.all, "list"] as const,
    detail: (id: string) => [...queryKeys.groups.all, id] as const,
  },
  modelltests: {
    all: ["modelltests"] as const,
    lists: () => [...queryKeys.modelltests.all, "list"] as const,
    detail: (id: string) => [...queryKeys.modelltests.all, id] as const,
  },
  modules: {
    all: ["modules"] as const,
    lists: () => [...queryKeys.modules.all, "list"] as const,
    detail: (id: string) => [...queryKeys.modules.all, id] as const,
  },
  parts: {
    all: ["parts"] as const,
    byModule: (modelltestModuleId: string) =>
      [...queryKeys.parts.all, "module", modelltestModuleId] as const,
    lists: () => [...queryKeys.parts.all, "list"] as const,
    detail: (id: string) => [...queryKeys.parts.all, id] as const,
  },
};
