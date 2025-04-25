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

import {CommonActions, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {Platform} from 'react-native';
import {LocaleConfig} from 'react-native-calendars';
import ImageResizer from 'react-native-image-resizer';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import {logOut} from '../../store/slice/UserSlice';

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

export const requestCameraPermission = async () => {
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

export const requestPhotoPermission = async () => {
  let permission;
  // openPhotoPicker().catch(() => {
  //   console.warn('Cannot open photo library picker');
  // });
  if (Platform.OS === 'ios') {
    permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
  } else {
    permission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
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

    baseUrl = 'https://dorun.site';

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
