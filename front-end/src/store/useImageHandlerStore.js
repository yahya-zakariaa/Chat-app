import { create } from "zustand";

const useImageHandlerStore = create((set) => ({
  isUpdatingAvatar: false,
  selectedImage: null,
  croppedImage: null,
  setSelectedImage: (image) => set({ selectedImage: image }),
  setCroppedImage: (image) => set({ croppedImage: image }),
  setIsUpdatingAvatar: (value) => set({ isUpdatingAvatar: value }),
}));

export default useImageHandlerStore;
