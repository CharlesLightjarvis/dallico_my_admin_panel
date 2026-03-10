import { create } from "zustand";

interface AppStore {
  /**
   * Vrai tant que l'app n'a pas terminé son bootstrap complet :
   * fetchUser() + première navigation router résolue.
   * Passe à false une seule fois, au premier idle du router.
   */
  isBootstrapping: boolean;
  setBootstrapped: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  isBootstrapping: true,
  setBootstrapped: () => set({ isBootstrapping: false }),
}));
