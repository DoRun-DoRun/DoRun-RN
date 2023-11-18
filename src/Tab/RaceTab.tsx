import React from 'react';
import {Pressable, Text} from 'react-native';
import {Pressable, Text} from 'react-native';
import {HomeContainer} from '../Component';
import {useNavigation} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

const RaceTab = () => {
  const navigation = useNavigation();

  return (
    <HomeContainer>
      <Text>RaceTab</Text>
      <Pressable
        onPress={() => navigation.navigate('FriendScreen' as never)}
        android_ripple={{color: '#eeeeee'}}>
        <Text>친구리스트 이동</Text>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate('SettingScreen' as never)}
        android_ripple={{color: '#eeeeee'}}>
        <Text>환경설정 페이지 이동</Text>
      </Pressable>
    </HomeContainer>
  );
};

export default RaceTab;
