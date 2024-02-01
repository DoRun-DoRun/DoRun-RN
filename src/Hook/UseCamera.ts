import {openSettings} from './../../node_modules/react-native-permissions/src/index';
import {useState} from 'react';
import {
  Asset,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {
  requestCameraPermission,
  requestPhotoPermission,
  resizeImage,
} from '../Component';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {Platform} from 'react-native';

const useCamera = () => {
  const [modalImage, setModalImage] = useState<Asset | null>(null);
  const [imageVisible, setImageVisible] = useState<boolean>(false);

  const onLaunchCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      const imagePickerOption: ImageLibraryOptions = {
        mediaType: 'photo',
        includeBase64: Platform.OS === 'android',
      };
      const onPickImage = async (res: ImagePickerResponse) => {
        if (res.didCancel || !res.assets || !res.assets[0].uri) {
          return;
        }
        const resizedImage = await resizeImage(res.assets[0].uri);
        if (resizedImage) {
          setModalImage({
            ...res.assets[0],
            uri: resizedImage.uri,
            fileSize: resizedImage.size,
          });
        }
      };

      launchCamera(imagePickerOption, onPickImage);
    } else {
      Toast.show({
        type: 'error',
        text1: '카메라 권한이 필요해요',
      });
      openSettings().catch(() => console.warn('cannot open settings'));
    }
  };

  const onLaunchLibary = async () => {
    const hasPermission = await requestPhotoPermission();
    console.log(hasPermission);

    if (hasPermission) {
      const imagePickerOption: ImageLibraryOptions = {
        mediaType: 'photo',
        includeBase64: Platform.OS === 'android',
      };
      const onPickImage = async (res: ImagePickerResponse) => {
        if (res.didCancel || !res.assets || !res.assets[0].uri) {
          return;
        }
        const resizedImage = await resizeImage(res.assets[0].uri);
        if (resizedImage) {
          setModalImage({
            ...res.assets[0],
            uri: resizedImage.uri,
            fileSize: resizedImage.size,
          });
        }
      };
      launchImageLibrary(imagePickerOption, onPickImage);
    } else {
      Toast.show({
        type: 'error',
        text1: '갤러리 접근 권한이 필요해요',
      });
      openSettings().catch(() => console.warn('cannot open settings'));
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
    onLaunchLibary,
    onViewPhoto,
    deletePhoto,
    modalImage,
    imageVisible,
  };
};

export default useCamera;
