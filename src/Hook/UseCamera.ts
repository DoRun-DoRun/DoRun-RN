import {useState} from 'react';
import {
  Asset,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {resizeImage} from '../Component';
import {Platform} from 'react-native';

const useCamera = () => {
  const [modalImage, setModalImage] = useState<Asset | null>(null);
  const [imageVisible, setImageVisible] = useState<boolean>(false);

  const onLaunchCamera = async () => {
    // const hasPermission = await requestStoragePermission();
    // if (!hasPermission) {
    //   // 권한이 없는 경우, 사용자에게 안내하고 작업을 중단합니다.
    //   console.log('Storage permission is not granted');
    //   return;
    // }

    const imagePickerOption: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 0,
      // includeBase64: Platform.OS === 'android',
    };
    const onPickImage = async (res: ImagePickerResponse) => {
      if (res.didCancel || !res.assets || !res.assets[0].uri) {
        return;
      }
      console.log(res.assets[0].uri);
      const resizedImage = await resizeImage(res.assets[0].uri);
      if (resizedImage) {
        setModalImage({
          ...res.assets[0],
          uri: resizedImage.uri,
          fileSize: resizedImage.size,
        });
      }
    };

    if (Platform.OS === 'ios' && !Platform.isPad) {
      launchImageLibrary(imagePickerOption, onPickImage);
    } else {
      launchCamera(imagePickerOption, onPickImage);
    }
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
