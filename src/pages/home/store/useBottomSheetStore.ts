// src/pages/home/store/useBottomSheetStore.ts
import { create } from "zustand";

type CSSLength = `${number}px` | `${number}vh` | `${number}vw` | `${number}%`;

interface BottomSheetState {
  open: boolean;
  heightPx: number;
  peekHeightPx: number;
  isPeek: boolean;
  defaultSize: number | CSSLength;
  defaultAriaLabel: string;

  setOpen: (v: boolean) => void;
  openSheet: () => void;
  closeSheet: () => void;
  toggle: () => void;
  setHeight: (px: number) => void;
  setPeekHeight: (px: number) => void;
}

export const useBottomSheetStore = create<BottomSheetState>((set, get) => ({
  open: false,
  heightPx: 0,
  peekHeightPx: 58,
  isPeek: true,
  defaultSize: "32vh",
  defaultAriaLabel: "bottom drawer",

  setOpen: v => set({ open: v }),
  openSheet: () => set({ open: true }),
  closeSheet: () => set({ open: false }),
  toggle: () => set(s => ({ open: !s.open })),

  setHeight: px => {
    const { peekHeightPx } = get();
    const isPeek = px <= peekHeightPx + 1;
    set({ heightPx: px, isPeek, open: !isPeek });
  },

  setPeekHeight: px => {
    const { heightPx } = get();
    const isPeek = heightPx <= px + 1;
    set({ peekHeightPx: px, isPeek, open: !isPeek });
  },
}));
