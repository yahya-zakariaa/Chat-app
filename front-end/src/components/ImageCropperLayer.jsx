import { useAuthStore } from "@/store/useAuthStore";
import useImageHandlerStore from "@/store/useImageHandlerStore";
import React, { useRef } from "react";
import { Cropper } from "react-cropper";
import toast from "react-hot-toast";

export default function ImageCropperLayer() {
  const {
    setSelectedImage,
    selectedImage,
    setCroppedImage,
    setIsUpdatingAvatar,
  } = useImageHandlerStore();

  const { updateUserPic } = useAuthStore();

  const cropperRef = useRef(null);

  const handleCropImage = async () => {
    if (!cropperRef.current) {
      return toast.error("Please select an image first");
    }

    const cropperInstance = cropperRef.current?.cropper;
    if (!cropperInstance) {
      return toast.error("Something went wrong - please try again later");
    }

    const croppedCanvas = cropperInstance.getCroppedCanvas();

    if (croppedCanvas) {
      const compressedCanvas = document.createElement("canvas");
      const ctx = compressedCanvas.getContext("2d");

      const scaleFactor = 1;
      compressedCanvas.width = croppedCanvas.width * scaleFactor;
      compressedCanvas.height = croppedCanvas.height * scaleFactor;

      ctx.drawImage(
        croppedCanvas,
        0,
        0,
        compressedCanvas.width,
        compressedCanvas.height
      );

      const compressedBase64 = compressedCanvas.toDataURL("image/jpeg", 0.6);
      setCroppedImage(compressedBase64);

      try {
        await updateUserPic({ avatar: compressedBase64 });
        setSelectedImage(null);
        setIsUpdatingAvatar(false);
      } catch (error) {
        toast.error("Failed to update profile picture. Please try again.");
      }
    } else {
      toast.error("Failed to crop the image");
    }
  };

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setSelectedImage(null);
          setCroppedImage(null);
          setIsUpdatingAvatar(false);
        }}
        className="absolute flex-col top-[0%] left-[0%]  flex justify-center items-center w-screen h-screen bg-black bg-opacity-60 z-[99999]"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="cropper-container  flex-col md:w-[40%] flex items-center justify-center rounded-xl relative md:-[60%] w-[90%] h-[90%] bg-[#121212] "
        >
          <button
            onClick={() => {
              setSelectedImage(null);
              setCroppedImage(null);
              setIsUpdatingAvatar(false);
            }}
            className="absolute top-6 right-4 text-white text-[20px]"
          >
            X
          </button>
          {selectedImage && (
            <div className=" ">
              <Cropper
                src={selectedImage}
                style={{
                  height: "400px",
                  width: "400px",
                  backgroundColor: "black",
                  position: "",
                }}
                initialAspectRatio={1}
                aspectRatio={1}
                guides={true}
                minCropBoxWidth={200}
                minCropBoxHeight={200}
                zoomable={false}
                ref={cropperRef}
              />
            </div>
          )}
          <button
            onClick={() => {
              handleCropImage();
            }}
            className=" text-black bg-white rounded-md font-medium px-7 py-4 text-[18px] mt-7"
          >
            save
          </button>
        </div>
      </div>
    </>
  );
}
