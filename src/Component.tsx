import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {launchCamera} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Share from 'react-native-share';
import ViewShot, {captureRef} from 'react-native-view-shot';
import {
  Pressable,
  Image,
  Platform,
  StyleSheet,
  Modal,
  // View,
  // ActionSheetIOS,
  useWindowDimensions,
  Text,
} from 'react-native';

interface ButtonType {
  children: React.ReactNode;
  type?: 'primary' | 'secondary' | 'gray';
  onPress?: () => void;
}

const ButtonContainer = styled.TouchableOpacity<{color: string}>`
  background-color: ${props => props.theme[props.color]};
  padding: 8px;
  width: 100%;
  align-items: center;
  border-radius: 10px;
`;

interface FontType {
  size: number;
  weight?: 'Bold' | 'Medium' | 'Regular';
  color?: string;
  lineHeight?: number;
  border?: boolean;
}

export const NotoSansKR = styled.Text<FontType>`
  color: ${({color, theme}) => (color ? theme[color] : theme.black)};
  /* 안드로이드에서 font 오류 */
  /* font-family: ${({weight}) => `NotoSansKR-${weight || 'Bold'}`}; */
  line-height: ${({lineHeight, size}) =>
    lineHeight ? lineHeight + 'px' : size * 1.75 + 'px'};
  font-size: ${({size}) => size + 'px'};
`;

export const InputNotoSansKR = styled.TextInput<FontType>`
  color: ${({color, theme}) => (color ? theme[color] : theme.black)};
  /* 안드로이드에서 font 오류 */
  /* font-family: ${({weight}) => `NotoSansKR-${weight || 'Bold'}`}; */
  line-height: ${({lineHeight, size}) =>
    lineHeight ? `${lineHeight}px` : `${size * 1.45}px`};
  font-size: ${({size}) => `${size}px`};
  padding: 0;
  padding-bottom: 4px;
  margin: 0;
  border-bottom-width: ${({border}) => (border ? '1px' : 0)};
`;

export const TossFace = styled.Text<{size: number}>`
  font-size: ${({size}) => size + 'px'};
  line-height: ${({size}) => size * 2 + 'px'};
  font-family: 'TossFaceFontMac';
`;

export const InnerContainer = styled.View<{gap?: number; seperate?: boolean}>`
  flex: 1;
  padding: 16px;
  text-align: left;
  justify-content: ${props =>
    props.seperate ? 'space-between' : 'flex-start'};
`;

export const HomeContainer = styled.SafeAreaView`
  position: relative;
  flex: 1;
  background-color: #fff;
`;

export const ScrollContainer = styled.ScrollView.attrs({
  showsHorizontalScrollIndicator: false,
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
`;

const RowScrollView = styled.View`
  flex-direction: row;
  padding: 0 16px;
`;

interface ScrollContainerType {
  children: React.ReactNode;
  gap?: number;
}

export const RowScrollContainer = ({children, gap}: ScrollContainerType) => {
  return (
    <ScrollContainer horizontal style={{marginLeft: -16, marginRight: -16}}>
      <RowScrollView style={{gap: gap}}>{children}</RowScrollView>
    </ScrollContainer>
  );
};

export const ButtonComponent = ({children, type, onPress}: ButtonType) => {
  let color = 'white';
  let backgroundColor = 'primary1';

  if (type === 'secondary') {
    color = 'gray4';
    backgroundColor = 'white';
  } else if (type === 'gray') {
    color = 'gray4';
    backgroundColor = 'gray7';
  }

  return (
    <ButtonContainer color={backgroundColor} onPress={onPress}>
      <NotoSansKR color={color} size={16} lineHeight={23}>
        {children}
      </NotoSansKR>
    </ButtonContainer>
  );
};

export const RowContainer = styled.View<{gap?: number; seperate?: boolean}>`
  flex-direction: row;
  align-items: center;
  justify-content: ${props =>
    props.seperate ? 'space-between' : 'flex-start'};
`;

interface API {
  endpoint: string;
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  accessToken?: string;
  body?: object;
}

interface Config {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  headers: {
    'Content-Type': string;
    Authorization?: string;
  };
  body?: string;
}

export async function CallApi({endpoint, method, accessToken, body}: API) {
  const url = `https://dorun.site/${endpoint}`;

  const config: Config = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  // return response.text();
  // 현재 API 호출 시 반환값이 json이 아니라 string 형태임. 추후 json으로 수정하겠음

  return response.json();
}

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

export const ViewImage = ({visible, onClose, res}: any) => {
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

export const PhotoView = () => {
  const [modalImage, setModalImage] = useState<any>(null);
  const [imageVisible, setImageVisible] = useState(false);

  const imagePickerOption: any = {
    mediaType: 'photo',
    selectionLimit: 0,
    includeBase64: Platform.OS === 'android',
  };

  const onPickImage = (res: any) => {
    if (res.didCancel || !res) {
      return;
    }
    setModalImage(res);
  };

  // 찍은 사진 확대모달로 보여주기
  const onViewImage = () => {
    setImageVisible(true);
  };

  // 카메라로 사진찍기
  const onLaunchCamera = () => {
    launchCamera(imagePickerOption, onPickImage);
  };

  const onPressToiOS = () => {
    onLaunchCamera();
  };

  return (
    <>
      <Pressable onPress={onPressToiOS}>
        <Text>사진 찍기</Text>
      </Pressable>
      <Pressable onPress={onViewImage}>
        <Text>찍은 이미지 보기</Text>
        <ViewImage
          visible={imageVisible}
          onClose={() => setImageVisible(false)}
          res={modalImage}
        />
      </Pressable>
    </>
  );
};

export const ImageSave = () => {
  const ref = useRef<ViewShot | null>(null);

  useEffect(() => {
    // on mount
    if (ref.current) {
      captureRef(ref, {
        format: 'jpg',
        quality: 0.9,
      }).then((uri: string) => {
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
    <>
      <Pressable
        // 클릭하면 viewRef를 이미지 파일로 변환해서 저장해 줌
        onPress={onShare}
        style={{padding: 10}}>
        <Icon name="share" size={18} color={'#000'} />
      </Pressable>
      <ViewShot
        ref={ref}
        options={{fileName: 'myContext', format: 'jpg', quality: 0.9}}
        style={onShareStyles.block}>
        <Text>context</Text>
      </ViewShot>
    </>
  );
};

const onShareStyles = StyleSheet.create({
  block: {
    backgroundColor: '#f7d8b7',
  },
});
