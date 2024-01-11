import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CreateChallengeScreen from './screens/CreateChallengeScreen';
import {MainTab} from './Tab/MainTab';

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
import {loadGoals, loadSetting} from '../store/async/asyncStore';
import {useDispatch} from 'react-redux';
import {restoreGoal} from '../store/slice/GoalSlice';
import {setVolume} from '../store/slice/SettingSlice';

import mobileAds from 'react-native-google-mobile-ads';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';

export type RootStackParamList = {
  DailyNoteScreen: {
    daily_no: number;
  };
  LoginTab: undefined;
  MainTab: undefined;
  CreateChallengeScreen: undefined;
  EditChallengeScreen: undefined;
  ProfileSettingScreen: undefined;
  FriendScreen: undefined;
  SettingScreen: undefined;
};

// Navigation 타입
export type NavigationType = NavigationProp<
  RootStackParamList,
  'DailyNoteScreen'
>;

// Route 타입
export type DailyNoteRouteType = RouteProp<
  RootStackParamList,
  'DailyNoteScreen'
>;

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // const CallApi = useApi();

  // const loginGuest = (refreshToken: string) =>
  //   CallApi({
  //     endpoint: 'user/login',
  //     method: 'GET',
  //     accessToken: refreshToken,
  //   });

  // const loginMutation = useMutation(loginGuest, {
  //   onSuccess: async data => {
  //     const {access_token} = data;

  //     if (access_token) {
  //       dispatch(setAccessToken({accessToken: access_token}));
  //       navigation.navigate('MainTab' as never);
  //     } else {
  //       console.error('Access token is missing in the response');
  //     }
  //   },
  // });

  useEffect(() => {
    const bootstrapAsync = async () => {
      // await AsyncStorage.removeItem('goals');
      const goalData = await loadGoals();
      if (goalData) {
        dispatch(restoreGoal(goalData));
      }
      // const userData = await loadUser();
      // if (userData?.refreshToken) {
      //   dispatch(setUser(userData));
      //   loginMutation.mutate(userData.refreshToken);
      // }
      const settingData = await loadSetting();
      if (settingData) {
        dispatch(setVolume(settingData));
      }
    };

    bootstrapAsync();
  }, [dispatch, navigation]);

  const getPermission = async () => {
    const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    if (result === RESULTS.DENIED) {
      console.log('거절');
      // The permission has not been requested, so request it.
      await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    }
  };
  getPermission();

  mobileAds()
    .initialize()
    .then(adapterStatuses => {
      console.log(adapterStatuses);
    });

  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTitle: '',

        headerLeft: () => (
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={'#1C1B1F'}
            onPress={() => navigation.goBack()}
          />
        ),
      }}>
      {/* <Stack.Screen
        name="TestTab2"
        component={TestTab2}
        options={{headerShown: false}}
      /> */}
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
