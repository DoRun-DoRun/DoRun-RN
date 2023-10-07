import React from 'react';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
const ChallengeScreen = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>ChallengeScreen</Text>
    </View>
  );
};

export default ChallengeScreen;
