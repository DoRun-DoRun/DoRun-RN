import React, {useState} from 'react';
import {Button, Text, View} from 'react-native';

import {
  KakaoOAuthToken,
  KakaoProfile,
  KakaoProfileNoneAgreement,
  getProfile,
  logout,
  login,
  unlink,
} from '@react-native-seoul/kakao-login';

function TestTab() {
  const [result, setResult] = useState<string>('');

  const signInWithKakao = async (): Promise<void> => {
    try {
      const token: KakaoOAuthToken = await login();
      console.log(token);

      setResult(JSON.stringify(token));
    } catch (err) {
      console.log(err);
    }
  };

  const signOutWithKakao = async (): Promise<void> => {
    try {
      const message = await logout();
      console.log(message);

      setResult(message);
    } catch (err) {
      console.log(err);
    }
  };

  const getKakaoProfile = async (): Promise<void> => {
    try {
      const profile: KakaoProfile | KakaoProfileNoneAgreement =
        await getProfile();
      console.log(profile);

      setResult(JSON.stringify(profile));
    } catch (err) {
      console.log(err);
    }
  };

  const unlinkKakao = async (): Promise<void> => {
    try {
      const message = await unlink();
      console.log(message);

      setResult(message);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View>
      <Text>result : {result}</Text>
      <Button
        testID="btn-login"
        onPress={() => signInWithKakao()}
        title={'카카오 로그인'}
      />
      <View style={{marginTop: 12}} />
      <Button
        testID="btn-login"
        onPress={() => unlinkKakao()}
        title={'링크 해제'}
      />
      <View style={{marginTop: 12}} />
      <Button
        testID="btn-login"
        onPress={() => getKakaoProfile()}
        title={'프로필 조회'}
      />
      <View style={{marginTop: 12}} />
      <Button onPress={() => signOutWithKakao()} title={'카카오 로그아웃'} />
      <View style={{marginTop: 40}} />
    </View>
  );
}

export default TestTab;
