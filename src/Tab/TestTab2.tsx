import LottieView from 'lottie-react-native';
import React from 'react';
import {HomeContainer, NotoSansKR} from '../Component';

const TestTab2 = () => {
  return (
    <HomeContainer>
      <LottieView
        source={require('../../assets/lottie/dudu0.json')}
        autoPlay
        loop
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
      />
      <NotoSansKR size={15}>테스트</NotoSansKR>
    </HomeContainer>
  );
};

export default TestTab2;
