import {KakaoOAuthToken, login} from '@react-native-seoul/kakao-login';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  ImageBackgroundProps,
  ImageProps,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from 'react-native';
import {useMutation} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {userDataType} from '../../store/async/asyncStore';
import {
  setAccessToken,
  setIsLoggedIn,
  setUser,
} from '../../store/slice/UserSlice';
import {NotoSansKR, RowContainer} from '../Component';

import {appleAuth} from '@invertase/react-native-apple-authentication';
import {SignType} from '../../store/data';

import jwtDecode from 'jwt-decode';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {RootState} from '../../store/RootReducer';
import {setSelectedChallengeMstNo} from '../../store/slice/ChallengeSlice';
import {useApi} from '../Hook/hook';

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

  const [groupFadeAnim] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);
  const [groupScaleAnim] = useState([
    new Animated.Value(0.8),
    new Animated.Value(0.8),
    new Animated.Value(0.8),
  ]);
  const [riseAnim] = useState([
    new Animated.Value(20),
    new Animated.Value(20),
    new Animated.Value(20),
  ]);
  const [riseFadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const animations = groupFadeAnim.map((anim, index) =>
      Animated.parallel([
        Animated.timing(anim, {
          toValue: 1,
          duration: 450 - index * 25,
          useNativeDriver: true,
        }),
        Animated.timing(groupScaleAnim[index], {
          toValue: 1,
          duration: 450 - index * 25,
          useNativeDriver: true,
        }),
      ]),
    );
    const animationsRaise = riseAnim.map(anim =>
      Animated.parallel([
        Animated.timing(anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(riseFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    );

    Animated.sequence([
      Animated.sequence(animations),
      Animated.sequence(animationsRaise),
    ]).start();
  }, [groupFadeAnim, groupScaleAnim, riseAnim, riseFadeAnim]);

  return (
    <View style={{flex: 1}}>
      {/* <BackgroundImage source={require('../../assets/image/background.jpg')} /> */}
      <BackgroundImage source={require('../../assets/image/login/No_10.png')} />
      <BackgroundImage source={require('../../assets/image/login/No_9.png')} />

      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          opacity: groupFadeAnim[2],
          transform: [{scale: groupScaleAnim[2]}],
        }}>
        <BackgroundImage
          source={require('../../assets/image/login/No_7.png')}
        />
        <BackgroundImage
          source={require('../../assets/image/login/No_6.png')}
        />
        <BackgroundImage
          source={require('../../assets/image/login/No_5.png')}
        />
      </Animated.View>

      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          opacity: groupFadeAnim[1],
          transform: [{scale: groupScaleAnim[1]}],
        }}>
        <BackgroundImage
          source={require('../../assets/image/login/No_8.png')}
        />
        <BackgroundImage
          source={require('../../assets/image/login/No_3.png')}
        />
      </Animated.View>

      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          opacity: groupFadeAnim[0],
          transform: [{scale: groupScaleAnim[0]}],
        }}>
        <BackgroundImage
          source={require('../../assets/image/login/No_4.png')}
        />
        <BackgroundImage
          source={require('../../assets/image/login/No_2.png')}
        />
      </Animated.View>

      <BackgroundImage source={require('../../assets/image/login/No_1.png')} />

      <LoginContainer>
        <Animated.View
          style={{
            opacity: riseFadeAnim,
            transform: [{translateY: riseAnim[0]}],
            gap: 12,
          }}>
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
              color="gray2"
              style={{
                textDecorationLine: 'underline',
                textAlign: 'center',
              }}>
              게스트 계정으로 시작하기
            </NotoSansKR>
          </TouchableOpacity>
        </Animated.View>
      </LoginContainer>
    </View>
  );
};

export default LoginTab;

const BackgroundImage: React.FC<ImageBackgroundProps> = ({style, ...rest}) => (
  <ImageBackground
    {...rest}
    style={[styles.bgImage, style]}
    resizeMode="contain"
  />
);

/* ------------------------------------------------------------------ */
/* 2) LoginContainer ------------------------------------------------- */
const LoginContainer: React.FC<ViewProps> = ({style, ...rest}) => (
  <View style={[styles.loginContainer, style]} {...rest} />
);

/* ------------------------------------------------------------------ */
/* 3) IconImage (size prop 유지) ------------------------------------- */
const IconImage: React.FC<
  {size: number; style?: ImageProps['style']} & Omit<ImageProps, 'style'>
> = ({size, style, ...rest}) => (
  <Image
    {...rest}
    style={[{width: size, height: size}, style]}
    resizeMode="contain"
  />
);

/* ------------------------------------------------------------------ */
/* 4) LoginButton (kakao prop 유지) ---------------------------------- */
const LoginButton: React.FC<{kakao?: boolean} & TouchableOpacityProps> = ({
  kakao,
  style,
  children,
  ...rest
}) => {
  const backgroundColor = kakao ? '#fddc3f' : '#fff';
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.loginButton,
        {backgroundColor},
        Platform.OS === 'ios' ? styles.iosShadow : styles.androidElevation,
        style,
      ]}
      {...rest}>
      {children}
    </TouchableOpacity>
  );
};

/* ------------------------------------------------------------------ */
/* 5) StyleSheet 객체 ------------------------------------------------ */
const styles = StyleSheet.create({
  bgImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    bottom: 0,
    flex: 1,
  },
  loginContainer: {
    position: 'absolute',
    width: '55%',
    minWidth: 210,
    alignSelf: 'center',
    bottom: '10%',
  },
  loginButton: {
    height: 40,
    marginTop: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  iosShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  androidElevation: {
    elevation: 3,
  },
});
