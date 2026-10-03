import { create } from "zustand";

type HeaderState = {
  menuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  pageEntityId: string | null;
  pageEntityType: "rent" | "buy" | "transfer" | "blogs" | null;
  setPageEntity: (id: string | null, type: "rent" | "buy" | "transfer" | "blogs" | null) => void;
};

export const useHeaderStore = create<HeaderState>((set) => ({
  menuOpen: false,
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),
  closeMenu: () => set({ menuOpen: false }),
  pageEntityId: null,
  pageEntityType: null,
  setPageEntity: (id, type) => set({ pageEntityId: id, pageEntityType: type }),
}));
