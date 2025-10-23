// src/pages/home/stores/useActiveGoalStore.ts
import { create } from "zustand";

interface ActiveGoalState {
  activeId: number | null;
  setActiveId: (id: number | null) => void;
}

export const useActiveGoalStore = create<ActiveGoalState>(set => ({
  activeId: null,
  setActiveId: id => set({ activeId: id }),
}));
