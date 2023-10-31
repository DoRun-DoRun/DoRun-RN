import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, InnerContainer} from '../Component';

const MainScreen = () => {
  return (
    <SafeAreaView>
      <InnerContainer>
        <Button>요소</Button>
        <Button type="secondary">😀</Button>
        <Button type="primary">요소</Button>
      </InnerContainer>
    </SafeAreaView>
  );
};

export default MainScreen;
