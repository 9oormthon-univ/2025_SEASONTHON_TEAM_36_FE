// src/pages/home/store/useBottomSheetStore.ts
import { create } from "zustand";

type CSSLength = `${number}px` | `${number}vh` | `${number}vw` | `${number}%`;

interface BottomSheetState {
  open: boolean;
  isExpanded: boolean;
  heightPx: number;
  peekHeightPx: number;
  isPeek: boolean;

  /** 열림 높이 (기본 32vh) */
  defaultSize: number | CSSLength;
  /** 확장 높이 (기본 58vh) */
  expandedSize: number | CSSLength;
  defaultAriaLabel: string;

  setOpen: (v: boolean) => void;
  openSheet: () => void;
  closeSheet: () => void;
  toggle: () => void;

  setHeight: (px: number) => void;
  setPeekHeight: (px: number) => void;

  setExpanded: (v: boolean) => void;
  expandSheet: () => void; // 확장으로
  collapseSheet: () => void; // 열림으로

  setDefaultSize: (v: number | CSSLength) => void;
  setExpandedSize: (v: number | CSSLength) => void;
}

export const useBottomSheetStore = create<BottomSheetState>((set, get) => ({
  open: false,
  isExpanded: false,
  heightPx: 0,
  peekHeightPx: 58,
  isPeek: true,

  defaultSize: "32vh", // ✅ 열림 높이: 32vh
  expandedSize: "58vh", // ✅ 확장 높이: 58vh
  defaultAriaLabel: "bottom drawer",

  setOpen: v => set({ open: v }),
  openSheet: () => set({ open: true, isExpanded: false }),
  closeSheet: () => set({ open: false, isExpanded: false }),
  toggle: () => set(s => ({ open: !s.open, isExpanded: false })),

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

  setExpanded: v => set({ isExpanded: v, open: v || get().open }),
  expandSheet: () => set({ isExpanded: true, open: true }),
  collapseSheet: () => set({ isExpanded: false, open: true }),

  setDefaultSize: v => set({ defaultSize: v }),
  setExpandedSize: v => set({ expandedSize: v }),
}));
