import { create } from "zustand";

export const useToggleComponents = create((set) => ({
  activeComponent: "default",
  isToggled: false,
  setIsToggled: (value) => set({ isToggled: value }),
  setActiveComponent: (component) => set({ activeComponent: component }),
  reset: () => set({ activeComponent: "default", isToggled: false }),
}));
