import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
const ChallengeScreen = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>챌린지 리스트 페이지</Text>
      <Pressable
        onPress={() => navigation.navigate('GoalList' as never)}
        android_ripple={{color: '#eeeeee'}}>
        <Text>챌린지 추가 버튼</Text>
      </Pressable>
    </View>
  );
};

export default ChallengeScreen;
