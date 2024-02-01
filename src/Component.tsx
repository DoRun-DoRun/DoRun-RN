import React, {useEffect, useRef} from 'react';
import styled, {useTheme} from 'styled-components/native';
import Share from 'react-native-share';
import ViewShot, {captureRef} from 'react-native-view-shot';
import {
  Platform,
  Modal,
  useWindowDimensions,
  View,
  ActivityIndicator,
} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import ImageResizer from 'react-native-image-resizer';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import LinearGradient from 'react-native-linear-gradient';

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
  font-family: ${({weight}) => `NotoSansKR-${weight || 'Bold'}`};
  line-height: ${({lineHeight, size}) =>
    lineHeight ? lineHeight + 'px' : size * 1.25 + 'px'};
  font-size: ${({size}) => size + 'px'};
  text-align: ${({textAlign}) => (textAlign ? textAlign : 'auto')};
`;

export const InputNotoSansKR = styled.TextInput.attrs(({theme}) => ({
  placeholderTextColor: theme.gray4,
}))<FontType>`
  ${Platform.OS === 'android' && 'include-font-padding: false;'}
  color: ${({color, theme}) => (color ? theme[color] : theme.black)};
  font-family: ${({weight}) => `NotoSansKR-${weight || 'Bold'}`};
  line-height: ${({size}) =>
    Platform.select({
      ios: '0px',
      android: `${size * 1.7}px`,
    })};
  font-size: ${({size}) => `${size}px`};
  padding: ${({border}) => (border ? '8px' : 0)};
  margin: 0;
  border-bottom-width: ${({border}) => (border ? '1px' : 0)};
`;

export const TossFace = styled.Text<{size: number}>`
  color: black;
  font-size: ${({size}) => `${size}px`};
  line-height: ${({size}) =>
    Platform.select({
      ios: '0px',
      android: `${size * 2.2}px`,
    })};
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
  padding-top: 0;
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

interface ButtonType {
  children: React.ReactNode;
  type?: 'primary' | 'secondary' | 'gray' | 'black';
  onPress?: () => void;
  disabled?: boolean;
}

const ButtonContainer = styled.TouchableOpacity`
  padding: 8px;
  width: 100%;
  align-items: center;
  border-radius: 10px;
`;

const ButtonContainerPress = styled.Pressable`
  padding: 8px;
  width: 100%;
  align-items: center;
  border-radius: 10px;
`;

export const ButtonComponent = ({
  children,
  type = 'primary',
  onPress,
  disabled = false,
}: ButtonType) => {
  const theme = useTheme();
  let color = 'white';
  let backgroundColor = theme.primary1;

  if (type === 'secondary') {
    color = 'gray4';
    backgroundColor = theme.white;
  } else if (type === 'gray') {
    color = 'gray4';
    backgroundColor = theme.gray7;
  } else if (type === 'black') {
    color = 'black';
    backgroundColor = theme.white;
  }

  if (disabled) {
    color = 'white';
    backgroundColor = theme.gray4;
  }

  return (
    <LinearGradient
      colors={
        type === 'primary' && !disabled
          ? ['#1727C3', '#6377F1', '#9EB7F6']
          : [backgroundColor, backgroundColor]
      }
      start={{x: 1.27, y: 4.29}}
      end={{x: -0.19, y: -2.08}}
      style={{borderRadius: 10}}>
      {Platform.OS === 'ios' ? (
        <ButtonContainer onPress={onPress} disabled={disabled}>
          <NotoSansKR color={color} size={16} lineHeight={23}>
            {children}
          </NotoSansKR>
        </ButtonContainer>
      ) : (
        <ButtonContainerPress
          android_ripple={{color: adjustBrightness(backgroundColor, 0.9)}}
          onPress={onPress}
          disabled={disabled}>
          <NotoSansKR color={color} size={16} lineHeight={23}>
            {children}
          </NotoSansKR>
        </ButtonContainerPress>
      )}
    </LinearGradient>
  );
};

export function adjustBrightness(hex: string, percent: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return (
    '#' +
    Math.round(r * percent)
      .toString(16)
      .padStart(2, '0') +
    Math.round(g * percent)
      .toString(16)
      .padStart(2, '0') +
    Math.round(b * percent)
      .toString(16)
      .padStart(2, '0')
  );
}

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
  formData?: boolean;
}

interface Config {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  url: string;
  headers: {
    'Content-Type'?: string;
    Authorization?: string;
  };
  data?: object | FormData;
}

export const useApi = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  async function CallApi({endpoint, method, accessToken, body, formData}: API) {
    let baseUrl = __DEV__
      ? Platform.OS === 'ios'
        ? 'http://127.0.0.1:8000' // iOS용 로컬 IP
        : 'http://10.0.2.2:8000' // Android용 로컬 서버
      : 'https://dorun.site';

    // baseUrl = 'https://dorun.site';

    const url = `${baseUrl}/${endpoint}`;

    try {
      const axiosConfig: Config = {
        method: method,
        url: url,
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
        data: body,
      };

      if (formData) {
        axiosConfig.headers['Content-Type'] = 'multipart/form-data';
      }

      const response = await axios(axiosConfig);

      return response.data;
    } catch (error) {
      // 오류 로깅 개선
      if (axios.isAxiosError(error)) {
        console.error(
          'Axios Error:',
          error.response?.data?.detail || error.message,
        );

        if (error.response?.data?.detail === '토큰이 만료되었습니다.') {
          Toast.show({
            type: 'error',
            text1: '장기간 접속하지 않으셔서 다시 로그인 해주세요!',
          });
          dispatch(logOut());
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'LoginTab'}],
            }),
          );
        } else {
          Toast.show({
            type: 'error',
            text1: error.response?.data?.detail || error.message,
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: '올바르지 않은 접근입니다',
        });

        console.error('Non-Axios error:', error);
      }

      throw error;
    }
  }

  return CallApi;
};

const ViewImageModalBackground = styled.TouchableOpacity`
  background-color: 'rgba(0,0,0,0.6)';
  justify-content: center;
  align-items: center;
`;

export const ModalViewPhoto = ({visible, onClose, res}: any) => {
  const width = useWindowDimensions().width;
  const height = useWindowDimensions().height;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <ViewImageModalBackground onPress={onClose}>
        <ViewImageStyles
          source={{uri: res?.uri}}
          width={width}
          height={height}
          resizeMode="contain"
        />
      </ViewImageModalBackground>
    </Modal>
  );
};

const ViewImageStyles = styled.Image<{height: any}>`
  width: ${props => props.height};
`;

export const ContentSave = ({
  children,
  file_name,
}: {
  children: React.ReactElement;
  file_name: string;
}) => {
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
  const childrenWithProps = React.cloneElement(children, {onShare});

  return (
    <>
      {/* <Pressable
        // 클릭하면 viewRef를 이미지 파일로 변환해서 저장해 줌
        onPress={onShare}
        style={{padding: 10}}>
        <Icon name="share" size={18} color={'#000'} />
      </Pressable> */}
      <ViewShot
        ref={ref}
        options={{
          fileName: file_name,
          format: 'jpg',
          quality: 0.9,
        }}
        style={{padding: 24}}>
        {childrenWithProps}
      </ViewShot>
    </>
  );
};

export const GetImage = (fileName: string) => {
  return `https://do-run.s3.amazonaws.com/${fileName}`;
};

export function formatDateToYYYYMM(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더함
  const formattedMonth = month < 10 ? `0${month}` : month.toString();

  return `${year}년 ${formattedMonth}월`;
}

export function convertKoKRToUTC(dateString: string) {
  const localDate = new Date(dateString); // 한국 시간대 GMT+9

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

export const isWithin24Hours = (end_dt: string) => {
  const now = new Date(); // 현재 시간 (UTC 기준)
  const endDate = new Date(end_dt); // 종료 시간을 Date 객체로 변환

  // 24시간을 밀리초로 변환 (24시간 * 60분 * 60초 * 1000밀리초)
  const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

  // 종료 시간과 현재 시간의 차이를 밀리초로 계산
  const differenceInMs = endDate.getTime() - now.getTime();

  // 차이가 24시간보다 작거나 같으면 true, 그렇지 않으면 false 반환
  return differenceInMs <= twentyFourHoursInMs;
};

export function convertUTCToKoKRDay(dateString: string) {
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const utcDate = new Date(dateString);

  // 한국 시간대로 변환 (UTC+9)
  const koreaTimeOffset = 9 * 60; // 9시간을 분 단위로 변환
  const localTime = new Date(utcDate.getTime() + koreaTimeOffset * 60000); // 밀리초 단위로 변환하여 더함

  // YYYY-MM-DD 형식으로 변환
  const year = localTime.getFullYear();
  const month = (localTime.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 1을 더함
  const day = localTime.getDate().toString().padStart(2, '0');
  const weekDay = weekDays[localTime.getDay()]; // 요일명 추출

  return `${year}-${month}-${day} (${weekDay})`;
}

export function convertUTCToKoKR(dateString: string) {
  const utcDate = new Date(dateString);

  // 한국 시간대로 변환 (UTC+9)
  const koreaTimeOffset = 9 * 60; // 9시간을 분 단위로 변환
  const localTime = new Date(utcDate.getTime() + koreaTimeOffset * 60000); // 밀리초 단위로 변환하여 더함

  // YYYY-MM-DD 형식으로 변환
  const year = localTime.getFullYear();
  const month = (localTime.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 1을 더함
  const day = localTime.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export const calculateDaysUntil = (startDateString: string) => {
  const startDate = new Date(startDateString);
  const currentDate = new Date(Date.now());

  const timeDifference = startDate.getTime() - currentDate.getTime();
  const daysUntil = Math.ceil(timeDifference / (1000 * 3600 * 24));

  return daysUntil;
};

export const calculateRemainTime = (endDtString: string) => {
  // 현재 UTC 시간
  const currentDateTimeUtc = new Date();
  // 종료 UTC 시간
  const endDateTimeUtc = new Date(`${endDtString}Z`);

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

export const timeSince = (utcDate: string) => {
  const now = new Date();
  const past = new Date(`${utcDate}Z`);

  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;

  const elapsed = now.getTime() - past.getTime();

  if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + '분 전';
  } else {
    return Math.round(elapsed / msPerHour) + '시간 전';
  }
};

export const LoadingIndicatior = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);

export const resizeImage = async (uri: string | undefined) => {
  if (!uri) {
    console.error('Error: URI is undefined');
    return null;
  }

  try {
    const resizedImage = await ImageResizer.createResizedImage(
      uri,
      800,
      600,
      'JPEG',
      80,
    );
    return resizedImage;
  } catch (error) {
    console.error('Error resizing image: ', error);
    return null;
  }
};

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDayOfWeek = (dateString: string) => {
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const date = new Date(dateString);
  return daysOfWeek[date.getDay()];
};

// export const GetTheme = () => {
//   const theme = useTheme();

//   return {
//     // arrows
//     arrowColor: theme.priamry1,
//     arrowStyle: {padding: 0},
//     // knob
//     expandableKnobColor: theme.primary1,
//     // month
//     monthTextColor: theme.gray4,
//     textMonthFontSize: 16,
//     // day names
//     textSectionTitleColor: 'black',
//     textDayHeaderFontSize: 15,
//     // dates
//     dayTextColor: 'black',
//     todayTextColor: theme.primary1,
//     textDayFontSize: 18,
//     textDayStyle: {marginTop: Platform.OS === 'android' ? 2 : 4},
//     // selected date
//     selectedDayBackgroundColor: theme.primary1,
//     selectedDayTextColor: theme.white,
//     // disabled date
//     textDisabledColor: theme.gray4,
//     // dot (marked date)
//     // dotColor: 'black',
//     // selectedDotColor: 'white',
//     // disabledDotColor: disabledColor,
//     // dotStyle: {marginTop: -2},
//   };
// };

import {LocaleConfig} from 'react-native-calendars';

LocaleConfig.locales.kr = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'kr';

import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {logOut} from '../store/slice/UserSlice';
import {useDispatch} from 'react-redux';

const requestCameraPermission = async () => {
  let permission;
  if (Platform.OS === 'ios') {
    permission = PERMISSIONS.IOS.CAMERA;
  } else {
    permission = PERMISSIONS.ANDROID.CAMERA;
  }

  const result = await check(permission);
  if (result === RESULTS.GRANTED) {
    // console.log('카메라 권한이 이미 허용되어 있습니다.');
    return true;
  } else {
    console.log(result);
  }

  const requestResult = await request(permission);
  return requestResult === RESULTS.GRANTED;
};

export default requestCameraPermission;
