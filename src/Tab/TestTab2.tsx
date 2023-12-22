import LottieView from 'lottie-react-native';
import React, {useState} from 'react';
import {HomeContainer, NotoSansKR} from '../Component';
import {Pressable, View} from 'react-native';

const TestTab2 = () => {
  const [selectedAnimation, setSelectedAnimation] = useState(0);

  const animation = [
    {title: 'peats(피츠)', url: require('../../assets/lottie/peats_boom.json')},
    {title: 'dudu(두두)', url: require('../../assets/lottie/dudu_boom.json')},
    {title: 'pachi(파치)', url: require('../../assets/lottie/pachi_boom.json')},
    {title: 'nuts(너츠)', url: require('../../assets/lottie/nuts_boom.json')},
  ];
  return (
    <HomeContainer>
      <LottieView
        source={animation[selectedAnimation].url}
        autoPlay
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
      />
      <View style={{flexDirection: 'row', gap: 18}}>
        {animation.map((data, index) => {
          return (
            <Pressable
              key={index}
              onPress={() => {
                setSelectedAnimation(index);
              }}>
              <NotoSansKR size={15}>{data.title}</NotoSansKR>
            </Pressable>
          );
        })}
      </View>
    </HomeContainer>
  );
};

export default TestTab2;
