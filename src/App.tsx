import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CreateChallengeScreen from './screens/CreateChallengeScreen';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import ProfileSettingScreen from './screens/ProfileSettingScreen';
import FriendScreen from './screens/FriendScreen';
import LoginTab from './Tab/LoginTab';
import SettingScreen from './screens/SettingScreen';
import EditChallengeScreen from './screens/EditChallengeScreen';
import {DailyNoteScreen} from './screens/DailyNoteScreen';
import {loadGoals, loadSetting, loadUser} from '../store/async/asyncStore';
import {useDispatch, useSelector} from 'react-redux';
import {restoreGoal} from '../store/slice/GoalSlice';
import {playMusic, setVolume, stopMusic} from '../store/slice/SettingSlice';

import mobileAds from 'react-native-google-mobile-ads';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import {AppState, AppStateStatus, Linking} from 'react-native';
import Toast from 'react-native-toast-message';
import {LoadingIndicatior, useApi} from './Component';
import {RootState} from '../store/RootReducer';
import {useMutation, useQueryClient} from 'react-query';
import {InviteAcceptType, SignType} from '../store/data';
import {setAccessToken, setUser} from '../store/slice/UserSlice';
import {MainTab} from './Tab/MainTab';
import {ChallengeListModal} from './Modal/ChallengeListModal';
import {useModal} from './Modal/ModalProvider';

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

function App() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const CallApi = useApi();
  const {accessToken, UID, isLoggedIn} = useSelector(
    (state: RootState) => state.user,
  );
  const [isLoading, setIsLoading] = useState(true);

  const {showModal} = useModal();

  const queryClient = useQueryClient();
  const [deepLinkUrl, setDeepLinkUrl] = useState('');
  const [initialRoute, setInitialRoute] =
    useState<keyof RootStackParamList>('LoginTab');

  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

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

  useEffect(() => {
    const bootstrapAsync = async () => {
      const userData = await loadUser();
      if (userData) {
        dispatch(setUser(userData));

        if (userData.SIGN_TYPE === SignType.KAKAO) {
          setInitialRoute('MainTab');
          loginMutation.mutate(userData.KAKAO);
        }
        if (userData.SIGN_TYPE === SignType.APPLE) {
          loginMutation.mutate(userData.APPLE);
          setInitialRoute('MainTab');
        }
        if (userData.SIGN_TYPE === SignType.GUEST) {
          loginMutation.mutate(userData.GUEST);
          setInitialRoute('MainTab');
        }
      }

      const goalData = await loadGoals();
      if (goalData) {
        dispatch(restoreGoal(goalData));
      }

      const settingData = await loadSetting();
      if (settingData) {
        dispatch(setVolume(settingData));
      }
      setIsLoading(false);
    };

    bootstrapAsync();
    mobileAds().initialize();
    // .then(adapterStatuses => {
    //   console.log(adapterStatuses);
    // });
    getPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const appStateChange = (nextAppState: AppStateStatus) => {
      console.log(nextAppState);
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        dispatch(playMusic());
      } else {
        dispatch(stopMusic());
      }
      setAppState(nextAppState);
    };

    const app = AppState.addEventListener('change', appStateChange);

    return () => {
      app.remove();
    };
  }, [appState, dispatch]);

  const getPermission = async () => {
    const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    if (result === RESULTS.DENIED) {
      await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    }
  };

  useEffect(() => {
    const handleDeepLink = (event: {url: string}) => {
      setDeepLinkUrl(event.url);
    };

    const unsubscribeLinking = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then(url => {
      if (url) {
        setDeepLinkUrl(url);
      }
    });

    return () => {
      unsubscribeLinking.remove();
    };
  }, []);

  useEffect(() => {
    const extractParamsFromUrl = (url: string) => {
      const queryParams = url.split('?')[1];
      const params = queryParams ? queryParams.split('&') : [];
      console.log(params);
      params.map(param => {
        const [key, value] = param.split('=');
        if (key === 'SENDER_NO') {
          if (UID! === parseInt(value, 10)) {
            Toast.show({
              type: 'error',
              text1: '나 자신에게 친구요청을 할 수 없습니다.',
            });
          } else {
            InviteFriend(parseInt(value, 10));
          }
        }
        if (key === 'INVITE_CHALLENGE_NO') {
          InviteChallenge(parseInt(value, 10));
        }
      });
    };

    if (isLoggedIn && deepLinkUrl) {
      extractParamsFromUrl(deepLinkUrl);
      setDeepLinkUrl('');
    }
  }, [isLoggedIn, deepLinkUrl, UID, InviteFriend, InviteChallenge]);

  if (isLoading) {
    return <LoadingIndicatior />;
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShadowVisible: false,
        headerTitle: '',
        // eslint-disable-next-line react/no-unstable-nested-components
        headerLeft: () => (
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={'#1C1B1F'}
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
