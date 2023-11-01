import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {InnerContainer} from '../Component';
import {Text} from 'react-native';

const MainScreen = () => {
  return (
    <SafeAreaView>
      <InnerContainer>
        <Text>Main</Text>
      </InnerContainer>
    </SafeAreaView>
  );
};

export default MainScreen;
