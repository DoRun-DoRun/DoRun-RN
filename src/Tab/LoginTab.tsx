import React, {useEffect} from 'react';
import {NotoSansKR, RowContainer, useApi} from '../Component';
import {styled} from 'styled-components/native';
import {Platform, TouchableOpacity, View} from 'react-native';
import {useMutation} from 'react-query';
import {
  setAccessToken,
  setIsLoggedIn,
  setUser,
} from '../../store/slice/UserSlice';
import {userDataType} from '../../store/async/asyncStore';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {KakaoOAuthToken, login} from '@react-native-seoul/kakao-login';

import {appleAuth} from '@invertase/react-native-apple-authentication';
import {SignType} from '../../store/data';
import {playMusic, stopMusic} from '../../store/slice/SettingSlice';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {jwtDecode} from 'jwt-decode';
import {RootState} from '../../store/RootReducer';
import {setSelectedChallengeMstNo} from '../../store/slice/ChallengeSlice';

interface AppleJwtToken {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  nonce: string;
  c_hash: string;
  email: string;
  email_verified: string;
  is_private_email: string;
  auth_time: number;
  nonce_supported: boolean;
}

interface KakaoJwtToken {
  aud: string;
  sub: string;
  auth_time: number;
  iss: string;
  nickname: string;
  exp: number;
  iat: number;
  email: string;
}

const LoginTab = () => {
  const CallApi = useApi();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(playMusic());

    return () => {
      dispatch(stopMusic());
    };
  }, [dispatch]);

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
      navigation.navigate('MainTab' as never);
    },
  });

  const signUp = ({signType, email}: {signType: SignType; email?: string}) =>
    CallApi({
      endpoint: 'user',
      method: 'POST',
      body: {USER_EMAIL: email ? email : null, SIGN_TYPE: signType},
    });

  const {
    mutate: SignUp,
    isLoading,
    error,
  } = useMutation(signUp, {
    onSuccess: response => {
      Toast.show({
        type: 'success',
        text1: `${response.SIGN_TYPE} 로그인 성공`,
      });

      const userDataRes: userDataType = {
        UID: response.UID,
        accessToken: response.access_token,
        userName: response.USER_NM,
        SIGN_TYPE: response.SIGN_TYPE,
        GUEST:
          response.SIGN_TYPE === SignType.GUEST ? response.refresh_token : null,
        APPLE:
          response.SIGN_TYPE === SignType.APPLE ? response.refresh_token : null,
        KAKAO:
          response.SIGN_TYPE === SignType.KAKAO ? response.refresh_token : null,
      };

      dispatch(setUser(userDataRes));
      dispatch(setIsLoggedIn());
      navigation.navigate('MainTab' as never);
    },
    onError: () => {
      console.error('Error:', error);
    },
  });

  const signInWithKakao = async (): Promise<void> => {
    try {
      const token: KakaoOAuthToken = await login();
      const payload: KakaoJwtToken = jwtDecode(token.idToken);
      SignUp({signType: SignType.KAKAO, email: payload.email});
    } catch (err) {
      console.log(err);
    }
  };

  const signInWithApple = async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    if (credentialState === appleAuth.State.AUTHORIZED) {
      const payload = jwtDecode<AppleJwtToken>(
        appleAuthRequestResponse.identityToken!,
      );
      SignUp({signType: SignType.APPLE, email: payload.email});
    }
  };

  useEffect(() => {
    // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
    // return appleAuth.onCredentialRevoked(async () => {
    //   console.warn(
    //     'If this function executes, User Credentials have been Revoked',
    //   );
    // });
  }, []); // passing in an empty array as the second argument ensures this is only ran once when component mounts initially.

  return (
    <View style={{flex: 1}}>
      <BackgroundImage source={require('../../assets/image/background.png')} />
      <LoginContainer>
        <Title source={require('../../assets/image/title.png')} />
        <LoginButton
          kakao
          disabled={isLoading}
          onPress={() => {
            dispatch(setSelectedChallengeMstNo(null));
            if (userData.KAKAO) {
              loginMutation.mutate(userData.KAKAO);
            } else {
              signInWithKakao();
            }
          }}>
          <RowContainer gap={8}>
            <IconImage
              source={require('../../assets/image/kakao_icon.png')}
              size={24}
            />
            <NotoSansKR
              size={14}
              style={{flex: 1, textAlign: 'center', alignSelf: 'center'}}>
              카카오톡으로 시작하기
            </NotoSansKR>
          </RowContainer>
        </LoginButton>

        {Platform.OS === 'ios' && (
          <LoginButton
            disabled={isLoading}
            onPress={() => {
              dispatch(setSelectedChallengeMstNo(null));
              if (userData?.APPLE) {
                loginMutation.mutate(userData.APPLE);
              } else {
                signInWithApple();
              }
            }}>
            <RowContainer gap={8}>
              <IconImage
                source={require('../../assets/image/apple_icon.png')}
                size={20}
              />
              <NotoSansKR
                size={14}
                style={{flex: 1, textAlign: 'center', alignSelf: 'center'}}>
                Apple로 시작하기
              </NotoSansKR>
            </RowContainer>
          </LoginButton>
        )}

        <TouchableOpacity
          disabled={isLoading}
          onPress={() => {
            dispatch(setSelectedChallengeMstNo(null));

            if (userData?.GUEST) {
              loginMutation.mutate(userData.GUEST);
            } else {
              SignUp({signType: SignType.GUEST});
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
  width: 210px;
  height: 38px;
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
