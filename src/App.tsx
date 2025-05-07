import {initializeKakaoSDK} from '@react-native-kakao/core';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useRef, useState} from 'react';

import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {loadGoals, loadSetting, loadUser} from '../store/async/asyncStore';
import {restoreGoal} from '../store/slice/GoalSlice';

import LoginTab from './Tab/LoginTab';

import {AppState, AppStateStatus, Linking, Platform} from 'react-native';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import {useMutation, useQueryClient} from 'react-query';
import {InviteAcceptType, SignType} from '../store/data';
import {RootState} from '../store/RootReducer';
import {setAccessToken, setUser} from '../store/slice/UserSlice';
import {LoadingIndicator} from './Component';
import {useApi} from './Hook/hook';
import {ChallengeListModal} from './Modal/ChallengeListModal';
import {useModal} from './Modal/ModalProvider';
import CreateChallengeScreen from './screens/CreateChallengeScreen';
import {DailyNoteScreen} from './screens/DailyNoteScreen';
import EditChallengeScreen from './screens/EditChallengeScreen';
import FriendScreen from './screens/FriendScreen';
import ProfileSettingScreen from './screens/ProfileSettingScreen';
import {MainTab} from './Tab/MainTab';

import TrackPlayer from 'react-native-track-player';
import {initTrackPlayer, setVolume} from '../store/slice/SettingSlice';
import {useAppDispatch} from './Hook/reduxHooks';
import SettingScreen from './screens/SettingScreen';

export type RootStackParamList = {
  DailyNoteScreen: {
    daily_no: number;
  };
  LoginTab: undefined;
  MainTab: undefined;
  CreateChallengeScreen: undefined;
  EditChallengeScreen: {
    challenge_mst_no: number;
  };
  ProfileSettingScreen: undefined;
  FriendScreen: undefined;
  SettingScreen: undefined;
};

// Navigation 타입
export type NavigationType = NavigationProp<
  RootStackParamList,
  'DailyNoteScreen',
  'EditChallengeScreen'
>;

// Route 타입
export type DailyNoteRouteType = RouteProp<
  RootStackParamList,
  'DailyNoteScreen'
>;

// Route 타입
export type EditChallengeRouteType = RouteProp<
  RootStackParamList,
  'EditChallengeScreen'
>;

const Stack = createNativeStackNavigator<RootStackParamList>();

TrackPlayer.registerPlaybackService(
  () => require('./theme/trackPlayerService').default,
);

function App() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const CallApi = useApi();
  const queryClient = useQueryClient();
  const {showModal} = useModal();

  const {accessToken, UID, isLoggedIn} = useSelector(
    (state: RootState) => state.user,
  );

  /* ---------- ① 스토어 / 사용자 데이터 부트스트랩 ---------- */
  const [isLoading, setIsLoading] = useState(true);
  const pendingUrl = useRef<string | null>(null);
  const [initialRoute, setInitialRoute] =
    useState<keyof RootStackParamList>('LoginTab');

  /* ---------- ② react‑query mutations ---------- */

  const changeFriend = (friendNo: number) =>
    CallApi({
      endpoint: `friend/${friendNo}?status=${InviteAcceptType.ACCEPTED}`,
      method: 'PUT',
      accessToken: accessToken!,
    });

  const {mutate: acceptFriend} = useMutation(changeFriend, {
    onSuccess: () => {
      queryClient.invalidateQueries('FriendListModal');
      Toast.show({
        type: 'success',
        text1: '친구추가 성공',
      });
      navigation.navigate('FriendScreen' as never);
    },
    onError: error => {
      console.error('Challenge Status Change Error:', error);
    },
  });

  const inviteFriend = (sender: number) =>
    CallApi({
      endpoint: `friend/${sender}`,
      method: 'POST',
      accessToken: accessToken!,
    });

  const {mutate: InviteFriend} = useMutation(inviteFriend, {
    onSuccess: response => {
      acceptFriend(response.FRIEND_NO);
    },
    onError: error => {
      console.error('Challenge Start Error:', error);
    },
  });

  const signIn = (refreshToken: string) =>
    CallApi({
      endpoint: 'user/login',
      method: 'GET',
      accessToken: refreshToken,
    });

  const loginMutation = useMutation(signIn, {
    onSuccess: async response => {
      Toast.show({
        type: 'success',
        text1: `${response.SIGN_TYPE} 로그인 성공`,
      });
      dispatch(
        setAccessToken({
          accessToken: response.access_token,
          SIGN_TYPE: response.SIGN_TYPE,
          UID: response.UID,
          userName: response.USER_NM,
        }),
      );
    },
  });

  const inviteChallenge = (challenge_mst_no: number) =>
    CallApi({
      endpoint: `challenge/link/${challenge_mst_no}`,
      method: 'PUT',
      accessToken: accessToken!,
    });

  const {mutate: InviteChallenge} = useMutation(inviteChallenge, {
    onSuccess: async response => {
      response.message === '참가 성공'
        ? (queryClient.invalidateQueries('getChallenge'),
          showModal(
            <ChallengeListModal
              count_challenge={response.challenge_count}
              challenge_mst_no={response.challenge}
            />,
          ))
        : Toast.show({
            type: 'error',
            text1: `${response.message}`,
          });
    },
  });

  /* ---------------------------------------------------------- */
  /*                        useEffect ①                         */
  /*  - 스토어 복원, 자동 로그인, 볼륨 설정 등 한 번만 실행       */
  /* ---------------------------------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        /* user ---------------------------------------------------------------- */
        const userData = await loadUser();
        if (userData) {
          dispatch(setUser(userData)); // store 에 복원

          const token =
            userData.SIGN_TYPE === SignType.KAKAO
              ? userData.KAKAO
              : userData.SIGN_TYPE === SignType.APPLE
                ? userData.APPLE
                : userData.GUEST;

          loginMutation.mutate(token);
          setInitialRoute('MainTab');
        }

        /* goal ---------------------------------------------------------------- */
        const goalData = await loadGoals();
        goalData && dispatch(restoreGoal(goalData));

        /* setting ------------------------------------------------------------- */
        const settingData = await loadSetting();
        dispatch(initTrackPlayer());
        settingData && dispatch(setVolume(settingData.volume));

        // console.log('queue', await TrackPlayer.getQueue());
        // console.log('state', await TrackPlayer.getState());
        // console.log('volume', await TrackPlayer.getVolume());

        setIsLoading(false);
      } catch (e) {
        console.error(e);
        setIsLoading(false);
      }
    })();
  }, []); // ← mount only

  /* ---------------------------------------------------------- */
  /*                        useEffect ②                         */
  /*  - AppState, 권한, 딥링크를 한 번에 관리                    */
  /* ---------------------------------------------------------- */
  useEffect(() => {
    initializeKakaoSDK('97d8ca4c2736fdb3f362246fe17f316b');

    /* ----- App Tracking Permission (iOS) -------------------- */
    const requestATT = async () => {
      if (Platform.OS !== 'ios') return;
      const status = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
      if (status === RESULTS.DENIED) {
        await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
      }
    };

    /* ----- AppState listener -------------------------------- */
    const onAppStateChange = (nextState: AppStateStatus) => {
      if (Platform.OS === 'ios' && nextState === 'active') {
        requestATT();
      }
    };
    const appStateSub = AppState.addEventListener('change', onAppStateChange);

    /* ----- 딥링크 처리 -------------------------------------- */
    const parseUrl = (url: string) => {
      const [, query] = url.split('?');
      if (!query) return;

      query.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key === 'SENDER_NO') {
          if (UID === Number(value)) {
            Toast.show({
              type: 'error',
              text1: '나 자신에게 친구요청을 할 수 없습니다.',
            });
          } else {
            InviteFriend(Number(value));
          }
        }
        if (key === 'INVITE_CHALLENGE_NO') {
          InviteChallenge(Number(value));
        }
      });
    };

    const handleDeepLink = ({url}: {url: string}) => {
      if (isLoggedIn) parseUrl(url);
      else pendingUrl.current = url; // 로그인 완료 후에 처리
    };

    const linkSub = Linking.addEventListener('url', handleDeepLink);

    // Initial URL
    Linking.getInitialURL().then(url => url && handleDeepLink({url}));

    /* ----- 로그인 완료 후 지연된 딥링크 처리 ---------------- */
    if (isLoggedIn && pendingUrl.current) {
      parseUrl(pendingUrl.current);
      pendingUrl.current = null;
    }

    /* ----- cleanup ----------------------------------------- */
    return () => {
      appStateSub.remove();
      linkSub.remove();
    };
  }, [isLoggedIn, UID]); // ← 로그인 여부가 바뀔 때만 재설정

  /* ---------------------------------------------------------- */
  /*                         Render                             */
  /* ---------------------------------------------------------- */
  if (isLoading) return <LoadingIndicator />;

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShadowVisible: false,
        headerTitle: '',
        headerLeft: () => (
          <MaterialIcons
            name="arrow-back"
            size={24}
            style={{paddingRight: 24}}
            color="#1C1B1F"
            onPress={() => navigation.goBack()}
          />
        ),
      }}>
      <Stack.Screen
        name="LoginTab"
        component={LoginTab}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MainTab"
        component={MainTab}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreateChallengeScreen"
        component={CreateChallengeScreen}
      />
      <Stack.Screen
        name="EditChallengeScreen"
        component={EditChallengeScreen}
      />
      <Stack.Screen
        name="ProfileSettingScreen"
        component={ProfileSettingScreen}
      />
      <Stack.Screen name="FriendScreen" component={FriendScreen} />
      <Stack.Screen name="SettingScreen" component={SettingScreen} />
      <Stack.Screen name="DailyNoteScreen" component={DailyNoteScreen} />
    </Stack.Navigator>
  );
}

export default App;
