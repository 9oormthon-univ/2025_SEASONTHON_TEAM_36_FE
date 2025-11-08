import { create } from "zustand";

type OnbUi = {
  bottomSheetOpen: boolean;
  openBottomSheet: () => void;
  closeBottomSheet: () => void;
  urgent: boolean;
  setUrgent: (v: boolean) => void;
  hasGoals: boolean;
  setHasGoals: (v: boolean) => void;
};

export const useOnbUiStore = create<OnbUi>(set => ({
  bottomSheetOpen: false,
  openBottomSheet: () => set({ bottomSheetOpen: true }),
  closeBottomSheet: () => set({ bottomSheetOpen: false }),
  urgent: false,
  setUrgent: v => set({ urgent: v }),

  hasGoals: true,
  setHasGoals: (v: boolean) => set({ hasGoals: v }),
}));
