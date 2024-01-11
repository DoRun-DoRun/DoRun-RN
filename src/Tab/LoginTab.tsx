import React, {useEffect} from 'react';
import {NotoSansKR, RowContainer, useApi} from '../Component';
import {styled} from 'styled-components/native';
import {Alert, Platform, TouchableOpacity, View} from 'react-native';
import {useMutation} from 'react-query';
import {setAccessToken, setUser} from '../../store/slice/UserSlice';
import {loadUser, userDataType} from '../../store/async/asyncStore';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
// import {
//   KakaoOAuthToken,
//   KakaoProfile,
//   KakaoProfileNoneAgreement,
//   getProfile,
//   login,
// } from '@react-native-seoul/kakao-login';

import {appleAuth} from '@invertase/react-native-apple-authentication';
import {appleAuthAndroid} from '@invertase/react-native-apple-authentication';
// import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';
import {SignType} from '../../store/data';
import {setSelectedChallengeMstNo} from '../../store/slice/ChallengeSlice';
import {playMusic, stopMusic} from '../../store/slice/SettingSlice';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

const signInWithApple = async () => {
  // performs login request
  if (Platform.OS === 'android') {
    // Android 기기에서 실행되는 코드
    console.log('This is an Android device');

    // Generate secure, random values for state and nonce
    const rawNonce = uuid();
    const state = uuid();

    // Configure the request
    appleAuthAndroid.configure({
      // The Service ID you registered with Apple
      clientId: 'com.example.CLife',

      // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
      // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
      // redirectUri: 'https://dorun.site/auth/callback',
      redirectUri: '',

      // The type of response requested - code, id_token, or both.
      responseType: appleAuthAndroid.ResponseType.ALL,

      // The amount of user information requested from Apple.
      scope: appleAuthAndroid.Scope.ALL,

      // Random nonce value that will be SHA256 hashed before sending to Apple.
      nonce: rawNonce,

      // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
      state,
    });

    // Open the browser window for user sign in
    const response = await appleAuthAndroid.signIn();

    Alert.alert('response값', response.toString(), [
      {text: '취소', onPress: () => console.log('취소됨')},
      {text: '확인', onPress: () => console.log('확인됨')},
    ]);
  } else {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated

      Toast.show({
        type: 'success',
        text1: '로그인 성공',
      });

      console.warn(appleAuthRequestResponse.user);
      console.warn(appleAuthRequestResponse.identityToken);
      console.warn(appleAuthRequestResponse.authorizationCode);
      console.warn(appleAuthRequestResponse.nonce);
    }
  }
};

// const signInWithKakao = async (): Promise<void> => {
//   try {
//     const token: KakaoOAuthToken = await login();
//     console.log(token);

//     // setResult(JSON.stringify(token));
//   } catch (err) {
//     console.log(err);
//   }
// };

// const getKakaoProfile = async (): Promise<void> => {
//   try {
//     const profile: KakaoProfile | KakaoProfileNoneAgreement =
//       await getProfile();
//     console.log(profile);
//   } catch (err) {
//     console.log(err);
//   }
// };

const LoginTab = () => {
  const CallApi = useApi();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(playMusic());

    return () => {
      dispatch(stopMusic());
    };
  }, [dispatch]);

  const loginGuest = (refreshToken: string) =>
    CallApi({
      endpoint: 'user/login',
      method: 'GET',
      accessToken: refreshToken,
    });

  const loginMutation = useMutation(loginGuest, {
    onSuccess: async data => {
      const {access_token} = data;

      if (access_token) {
        dispatch(setAccessToken({accessToken: access_token}));
        navigation.navigate('MainTab' as never);
      } else {
        console.error('Access token is missing in the response');
      }
    },
  });

  const createGuest = () =>
    CallApi({
      endpoint: 'user',
      method: 'POST',
      body: {SIGN_TYPE: SignType.GUEST},
    });

  const {
    mutate: create_guest,
    isLoading,
    error,
  } = useMutation(createGuest, {
    onSuccess: response => {
      // 요청 성공 시 수행할 작업
      const userData: userDataType = {
        UID: response.UID,
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        userName: response.USER_NM,
        SIGN_TYPE: SignType.GUEST,
        USER_EMAIL: '',
      };

      dispatch(setUser(userData));
      // console.log('Success:', userData);
      navigation.navigate('MainTab' as never);
    },
    onError: () => {
      console.error('Error:', error);
    },
  });

  useEffect(() => {
    // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
    // return appleAuth.onCredentialRevoked(async () => {
    //   console.warn(
    //     'If this function executes, User Credentials have been Revoked',
    //   );
    // });
  }, []); // passing in an empty array as the second argument ensures this is only ran once when component mounts initially.

  // useEffect(() => {
  //   const bootstrapAsync = async () => {
  //     const userData = await loadUser();
  //     if (userData?.refreshToken) {
  //       dispatch(setUser(userData));
  //       loginMutation.mutate(userData.refreshToken);
  //     }
  //   };

  //   bootstrapAsync();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dispatch, navigation]);

  return (
    <View style={{flex: 1}}>
      <BackgroundImage source={require('../../assets/image/background.png')} />
      <LoginContainer>
        <Title source={require('../../assets/image/title.png')} />
        <LoginButton
          kakao
          onPress={() => {
            // signInWithKakao();
            // getKakaoProfile();
          }}>
          <RowContainer gap={8}>
            <IconImage
              source={require('../../assets/image/kakao_icon.png')}
              size={24}
            />
            <NotoSansKR size={14} style={{flex: 1, textAlign: 'center'}}>
              카카오톡으로 시작하기
            </NotoSansKR>
          </RowContainer>
        </LoginButton>
        <LoginButton onPress={() => signInWithApple()}>
          <RowContainer gap={8}>
            <IconImage
              source={require('../../assets/image/apple_icon.png')}
              size={20}
            />
            <NotoSansKR size={14} style={{flex: 1, textAlign: 'center'}}>
              Apple로 시작하기
            </NotoSansKR>
          </RowContainer>
        </LoginButton>

        <TouchableOpacity
          disabled={isLoading}
          onPress={async () => {
            const userData = await loadUser();
            dispatch(setSelectedChallengeMstNo(null));

            if (userData?.refreshToken) {
              dispatch(setUser(userData));
              loginMutation.mutate(userData.refreshToken);
            } else {
              create_guest();
            }
          }}>
          <NotoSansKR
            size={14}
            weight="Medium"
            color="white"
            style={{
              textDecorationLine: 'underline',
              textAlign: 'center',
            }}>
            게스트 계정으로 시작하기
          </NotoSansKR>
        </TouchableOpacity>
      </LoginContainer>
    </View>
  );
};

const BackgroundImage = styled.ImageBackground`
  position: absolute;
  width: 100%;
  height: 100%;
  resize: contian;
  flex: 1;
  bottom: 0;
`;

const LoginContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  padding: 32px;
  gap: 12px;
  margin-bottom: 16px;
`;

const Title = styled.Image`
  margin-bottom: 44px;
`;

const IconImage = styled.Image<{size: number}>`
  width: ${({size}) => `${size}px`};
  height: ${({size}) => `${size}px`};
`;

const LoginButton = styled.TouchableOpacity<{kakao?: boolean}>`
  width: 200px;
  margin-top: 6px;
  /* background-color: ${props => props.theme.secondary1}; */
  background-color: ${({kakao}) => (kakao ? '#fddc3f' : '#fff')};
  padding: 8px 16px 8px 12px;
  /* padding: 12px 24px; */
  border-radius: 5px;
  ${Platform.OS === 'ios'
    ? `
    shadow-color: #000;
    shadow-offset: 2px 2px;
    shadow-opacity: 0.3;
    shadow-radius: 2px;
  `
    : 'elevation: 3;'}
`;

export default LoginTab;
