import React, {Dispatch, useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {launchCamera} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Share from 'react-native-share';
import ViewShot, {captureRef} from 'react-native-view-shot';
import {Pressable, Platform, Modal, useWindowDimensions} from 'react-native';
import {setAccessToken} from '../store/slice/UserSlice';
import {AnyAction} from 'redux';
import {useNavigation} from '@react-navigation/native';

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
  textAlign?: 'center';
  border?: boolean;
}

export const NotoSansKR = styled.Text<FontType>`
  color: ${({color, theme}) => (color ? theme[color] : theme.black)};
  /* 안드로이드에서 font 오류 */
  /* font-family: ${({weight}) => `NotoSansKR-${weight || 'Bold'}`}; */
  line-height: ${({lineHeight, size}) =>
    lineHeight ? lineHeight + 'px' : size * 1.75 + 'px'};
  font-size: ${({size}) => size + 'px'};
  text-align: ${({textAlign}) => (textAlign ? textAlign : 'auto')};
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

export const HomeContainer = styled.SafeAreaView<{color?: string}>`
  position: relative;
  flex: 1;
  background-color: ${({color, theme}) => (color ? theme[color] : theme.white)};
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
export const useApi = () => {
  const navigation = useNavigation();

  async function CallApi({endpoint, method, accessToken, body}: API) {
    const url = `http://127.0.0.1:8000/${endpoint}`;
    const config: Config = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
      body: body && method !== 'GET' ? JSON.stringify(body) : undefined,
    };

    try {
      let response = await fetch(url, config);

      if (!response.ok) {
        const errorBody = await response.json();

        if (errorBody.detail === '토큰이 만료되었습니다.') {
          navigation.navigate('LoginTab' as never);
        }

        throw new Error(
          `API call failed: ${response.status}, Details: ${errorBody.detail}`,
        );
      }
      return await response.json();
    } catch (error) {
      console.error(`Error during API call to ${url}: ${error}`);
      console.error(accessToken);
      throw error;
    }
  }
  return CallApi;
};

export const RefreshToken = async (
  dispatch: Dispatch<AnyAction>,
  accessToken?: string | null,
) => {
  const url = 'http://127.0.0.1:8000/user/callback';
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);

    dispatch(setAccessToken(data.access_token));
    return data.access_token;
  } catch (error) {
    console.error('Error during token refresh:', error);
    throw error;
  }
};

const ViewImageModalBackground = styled.TouchableOpacity`
  background-color: 'rgba(0,0,0,0.6)';
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const ViewImage = ({visible, onClose, res}: any) => {
  const width = useWindowDimensions().width;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <ViewImageModalBackground onPress={onClose}>
        <ViewImageStyles
          source={{uri: res?.assets[0]?.uri}}
          height={width}
          resizeMode="cover"
        />
      </ViewImageModalBackground>
    </Modal>
  );
};

const ViewImageStyles = styled.Image<{height: any}>`
  width: ${props => props.height};
`;

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
        <NotoSansKR size={12}>사진 찍기</NotoSansKR>
      </Pressable>
      <Pressable onPress={onViewImage}>
        <NotoSansKR size={12}>찍은 이미지 보기</NotoSansKR>
        <ViewImage
          visible={imageVisible}
          onClose={() => setImageVisible(false)}
          res={modalImage}
        />
      </Pressable>
    </>
  );
};

export const ContentSave = ({children}: {children: React.ReactNode}) => {
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
        options={{fileName: 'myContext', format: 'jpg', quality: 0.9}}>
        {children}
      </ViewShot>
    </>
  );
};
export const GetImage = (fileName: string) => {
  return `https://do-run.s3.amazonaws.com/${fileName}`;
};
export function convertKoKRToUTC(dateString: string) {
  // 한국 시간대의 'YYYY-MM-DD' 문자열을 Date 객체로 변환
  const localDate = new Date(dateString + 'T00:00:00+09:00'); // 한국 시간대 GMT+9

  // UTC Date 객체 생성
  const utcDate = new Date(
    localDate.getUTCFullYear(),
    localDate.getUTCMonth(),
    localDate.getUTCDate(),
    localDate.getUTCHours(),
    localDate.getUTCMinutes(),
    localDate.getUTCSeconds(),
  );

  return utcDate;
}

export const calculateDaysUntil = (startDateString: string) => {
  const startDate = new Date(startDateString);
  const currentDate = new Date(Date.now());

  const timeDifference = startDate.getTime() - currentDate.getTime();
  const daysUntil = Math.ceil(timeDifference / (1000 * 3600 * 24));

  return daysUntil;
};

export const calculateTimeDifference = (endDtString: string) => {
  const currentDateTimeUtc = new Date(Date.now()); // 현재 시간 (UTC)
  const endDateTimeUtc = new Date(endDtString); // 종료 시간 (UTC)

  let timeDifference = endDateTimeUtc.getTime() - currentDateTimeUtc.getTime();

  // 차이가 음수인 경우, 0으로 설정
  if (timeDifference < 0) {
    timeDifference = 0;
  }

  // 밀리초를 시간과 분으로 변환
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

  // 시간과 분을 문자열로 포매팅
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
};
