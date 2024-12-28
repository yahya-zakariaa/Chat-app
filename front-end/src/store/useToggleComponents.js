import { create } from "zustand";
import { is } from './../../.next/static/chunks/[root of the server]__577f55._';

export const useToggleComponents = create((set) => ({
  activeComponent: "default",
  setActiveComponent: (component) => set({ activeComponent: component }),
}));
