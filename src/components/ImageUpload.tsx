import React, {useEffect, useRef, useState} from 'react';
import {
  Pressable,
  Image,
  Platform,
  StyleSheet,
  Modal,
  View,
  ActionSheetIOS,
  useWindowDimensions,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Share from 'react-native-share';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ViewShot, {captureRef} from 'react-native-view-shot';

const UploadModeModal = ({
  visible,
  onClose,
  onLaunchCamera,
  onLaunchImageLibrary,
}: any) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={UploadModeModalStyles.background} onPress={onClose}>
        <View style={UploadModeModalStyles.whiteBox}>
          <Pressable
            style={UploadModeModalStyles.actionButton}
            android_ripple={{color: '#eee'}}
            onPress={() => {
              onLaunchCamera();
              onClose();
            }}>
            <Icon
              name="camera-alt"
              color="#757575"
              size={24}
              style={UploadModeModalStyles.icon}
            />
            <Text style={UploadModeModalStyles.actionText}>
              카메라로 촬영하기
            </Text>
          </Pressable>
          <Pressable
            style={UploadModeModalStyles.actionButton}
            android_ripple={{color: '#eee'}}
            onPress={() => {
              onLaunchImageLibrary();
              onClose();
            }}>
            <Icon
              name="photo"
              color="#757575"
              size={24}
              style={UploadModeModalStyles.icon}
            />
            <Text style={UploadModeModalStyles.actionText}>사진 선택하기</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const UploadModeModalStyles = StyleSheet.create({
  background: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteBox: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 4,
    elevation: 2,
  },
  actionButton: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  actionText: {
    fontSize: 16,
  },
});

const ViewImage = ({visible, onClose, res}: any) => {
  const {width} = useWindowDimensions();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={UploadModeModalStyles.background} onPress={onClose}>
        <Image
          source={{uri: res?.assets[0]?.uri}}
          style={[ViewImageStyles.image, {height: width}]}
          resizeMode="cover"
        />
      </Pressable>
    </Modal>
  );
};

const ViewImageStyles = StyleSheet.create({
  block: {
    flex: 1,
  },
  image: {width: '100%'},
});

export const ImageUploadSample = () => {
  const [modalImage, setModalImage] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);

  // 이미지 모달로 보여주기
  const imagePickerOption: any = {
    mediaType: 'photo',
    selectionLimit: 0,
    maxWidth: 768,
    maxHeight: 768,
    includeBase64: Platform.OS === 'android',
  };

  const onPickImage = (res: any) => {
    if (res.didCancel || !res) {
      return;
    }
    setModalImage(res);
  };

  const onLaunchCamera = () => {
    launchCamera(imagePickerOption, onPickImage);
  };

  const onLaunchImageLibrary = () => {
    launchImageLibrary(imagePickerOption, onPickImage);
  };

  const onViewImage = () => {
    setImageVisible(true);
  };

  const onPressToiOS = () => {
    if (Platform.OS === 'android') {
      setModalVisible(true);
      return;
    }

    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: '사진 업로드',
        options: ['카메라로 촬영하기', '사진 선택하기', '취소'],
        cancelButtonIndex: 2,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          onLaunchCamera();
        } else if (buttonIndex === 1) {
          onLaunchImageLibrary();
        }
      },
    );
  };

  // 프로필 이미지 선택 + 보여주기
  const onSelectCircleImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: Platform.OS === 'android',
        selectionLimit: 1, // 선택할 이미지 수, 0 = 무제한
      },
      res => {
        console.log(res);
        if (res.didCancel) {
          return;
        }
        setResponse(res);
      },
    );
  };

  return (
    <>
      <Pressable onPress={onPressToiOS}>
        <Text>이미지 선택</Text>
        <UploadModeModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onLaunchCamera={onLaunchCamera}
          onLaunchImageLibrary={onLaunchImageLibrary}
        />
      </Pressable>
      <Pressable onPress={onViewImage}>
        <Text>선택된 이미지 보기</Text>
        <ViewImage
          visible={imageVisible}
          onClose={() => setImageVisible(false)}
          res={modalImage}
        />
      </Pressable>
      <Pressable onPress={onSelectCircleImage}>
        <Image
          style={ImageUploadSampleStyles.circle}
          source={{uri: response?.assets[0]?.uri}}
        />
      </Pressable>
    </>
  );
};

const ImageUploadSampleStyles = StyleSheet.create({
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50, // 원 모양을 만들기 위한 값
    backgroundColor: 'blue', // 배경 색상
  },
});

export const ImageSave = () => {
  const ref = useRef<ViewShot | null>(null);

  useEffect(() => {
    // on mount
    if (ref.current) {
      ref.current?.capture().then(uri => {
        console.log('do something with ', uri);
      });
    }
  }, []);

  const onShare = async () => {
    try {
      console.log('click');

      const uri = await captureRef(ref, {
        format: 'jpg',
        quality: 0.9,
      });

      let options = {
        title: 'Share via',
        message: 'Check out this image!',
        url: Platform.OS === 'ios' ? `file://${uri}` : uri,
      };
      await Share.open(options);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <ViewShot
      ref={ref}
      options={{fileName: 'myContext', format: 'jpg', quality: 0.9}}
      style={onShareStyles.block}>
      <Pressable
        // 클릭하면 viewRef를 이미지 파일로 변환해서 저장해 줌
        onPress={onShare}
        style={{padding: 10}}>
        <Icon name="share" size={18} color={'#000'} />
      </Pressable>
      <Text>context</Text>
    </ViewShot>
  );
};

const onShareStyles = StyleSheet.create({
  block: {
    backgroundColor: '#f7d8b7',
  },
});
