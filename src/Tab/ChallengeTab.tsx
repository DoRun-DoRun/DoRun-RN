import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Pressable, Text} from 'react-native';
import {Container} from '../Component';

const ChallengeTab = () => {
  const navigation = useNavigation();
  return (
    <Container>
      <Text>ChallengeTab</Text>
      <Pressable
        onPress={() => navigation.navigate('CreateChallengeScreen' as never)}
        android_ripple={{color: '#eeeeee'}}>
        <Text>챌린지 추가 버튼</Text>
      </Pressable>
    </Container>
  );
};

export default ChallengeTab;
