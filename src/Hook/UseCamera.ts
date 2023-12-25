import {useState} from 'react';
import {Platform} from 'react-native';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
} from 'react-native-image-picker';

const useCamera = () => {
  const [modalImage, setModalImage] = useState<any>(null);
  const [imageVisible, setImageVisible] = useState<boolean>(false);

  const onLaunchCamera = () => {
    const imagePickerOption: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 0,
      includeBase64: Platform.OS === 'android',
    };

    const onPickImage = (res: ImagePickerResponse) => {
      if (res.didCancel || !res) {
        return;
      }
      setModalImage(res);
    };

    launchCamera(imagePickerOption, onPickImage);
  };

  const onViewPhoto = () => {
    setImageVisible(!imageVisible);
  };

  const deletePhoto = () => {
    setModalImage(null);
  };

  return {
    onLaunchCamera,
    onViewPhoto,
    deletePhoto,
    modalImage,
    imageVisible,
  };
};

export default useCamera;
