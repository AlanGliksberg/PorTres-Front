import { useCallback, useContext, useMemo } from "react";
import * as ImagePicker from "expo-image-picker";

import { ModalContext } from "@/src/contexts/ModalContext";

type PhotoPickerOptions = {
  aspect?: [number, number];
  quality?: number;
  cameraType?: ImagePicker.CameraType;
  shape?: ImagePicker.CropShape;
};

type OnPicked = (asset: ImagePicker.ImagePickerAsset) => Promise<void> | void;

const defaultOptions: Required<PhotoPickerOptions> = {
  aspect: [1, 1],
  quality: 0.7,
  cameraType: ImagePicker.CameraType.front,
  shape: "oval",
};

export default function usePhotoPicker(
  options: PhotoPickerOptions = defaultOptions
) {
  const mergedOptions = useMemo(
    () => ({ ...defaultOptions, ...options }),
    [options]
  );
  const { openModal, closeModal, openErrorModal } = useContext(ModalContext);
  const [galleryPermission, requestGalleryPermission] =
    ImagePicker.useMediaLibraryPermissions();
  const [cameraPermission, requestCameraPermission] =
    ImagePicker.useCameraPermissions();

  const requestGalleryAccess = useCallback(async () => {
    if (galleryPermission?.granted) return true;
    const permissionResult = await requestGalleryPermission();
    if (!permissionResult.granted) {
      openErrorModal(
        "Permisos",
        "Necesitamos acceder a tu galería para que puedas elegir tu foto."
      );
      return false;
    }
    return true;
  }, [galleryPermission, openErrorModal, requestGalleryPermission]);

  const requestCameraAccess = useCallback(async () => {
    if (cameraPermission?.granted) return true;
    const permissionResult = await requestCameraPermission();
    if (!permissionResult.granted) {
      openErrorModal(
        "Permisos",
        "Necesitamos acceder a tu cámara para que puedas tomar una foto."
      );
      return false;
    }
    return true;
  }, [cameraPermission, openErrorModal, requestCameraPermission]);

  const pickFromGallery = useCallback(async () => {
    const hasPermission = await requestGalleryAccess();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: mergedOptions.aspect,
      cameraType: mergedOptions.cameraType,
      quality: mergedOptions.quality,
      shape: mergedOptions.shape,
    });

    if (result.canceled || !result.assets?.length) return null;
    return result.assets[0];
  }, [mergedOptions, requestGalleryAccess]);

  const takePhoto = useCallback(async () => {
    const hasPermission = await requestCameraAccess();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: mergedOptions.aspect,
      cameraType: mergedOptions.cameraType,
      quality: mergedOptions.quality,
      shape: mergedOptions.shape,
    });

    if (result.canceled || !result.assets?.length) return null;
    return result.assets[0];
  }, [mergedOptions, requestCameraAccess]);

  const openPhotoPicker = useCallback(
    (onPicked: OnPicked) => {
      openModal({
        title: "Seleccioná tu foto",
        message: "Podés tomarla ahora o elegir una de tu galería.",
        primaryLabel: "Elegir de galería",
        primaryAction: async () => {
          closeModal();
          const asset = await pickFromGallery();
          if (asset) await onPicked(asset);
        },
        secondaryLabel: "Tomar foto",
        secondaryAction: async () => {
          closeModal();
          const asset = await takePhoto();
          if (asset) await onPicked(asset);
        },
      });
    },
    [closeModal, openModal, pickFromGallery, takePhoto]
  );

  return {
    openPhotoPicker,
    pickFromGallery,
    takePhoto,
  };
}
