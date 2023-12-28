import {openSettings} from './../../node_modules/react-native-permissions/src/index';
import {useState} from 'react';
import {
  Asset,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
} from 'react-native-image-picker';
import requestCameraPermission, {resizeImage} from '../Component';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

const useCamera = () => {
  const [modalImage, setModalImage] = useState<Asset | null>(null);
  const [imageVisible, setImageVisible] = useState<boolean>(false);

  const onLaunchCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
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
      // if (Platform.OS === 'ios' && !Platform.isPad) {
      //   launchImageLibrary(imagePickerOption, onPickImage);
      // } else {
      //   launchCamera(imagePickerOption, onPickImage);
      // }
      launchCamera(imagePickerOption, onPickImage);
    } else {
      console.log('카메라 접근이 거부되었습니다.');
      Toast.show({
        type: 'error',
        text1: '카메라 권한이 필요해요',
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
    onViewPhoto,
    deletePhoto,
    modalImage,
    imageVisible,
  };
};

export default useCamera;
