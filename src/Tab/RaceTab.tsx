import React from 'react';
import {Pressable, View} from 'react-native';
import {HomeContainer, ScrollContainer} from '../Component';
import {useNavigation} from '@react-navigation/native';
import OcticonIcons from 'react-native-vector-icons/Octicons';
import styled from 'styled-components/native';

const RaceTab = () => {
  return (
    <HomeContainer>
      <ScrollContainer>
        <BGComponent BGN={0} />
        <BGComponent BGN={1} />
        <BGComponent BGN={2} />
        <BGComponent BGN={3} />
        <BGComponent BGN={1} />
        <BGComponent BGN={2} />
        <Navigation />
      </ScrollContainer>
    </HomeContainer>
  );
};

const BGComponent = ({BGN}: {BGN: number}) => {
  const BGA = [
    {url: require('../../assets/images/BGAHeader1.png'), height: 176},
    {url: require('../../assets/images/BGABody1.png'), height: 137},
    {url: require('../../assets/images/BGABody2.png'), height: 137},
    {url: require('../../assets/images/BGABody3.png'), height: 137},
  ];
  const Dudus = [
    require('../../assets/images/dudu00.png'),
    require('../../assets/images/nuts00.png'),
    require('../../assets/images/pachi00.png'),
    require('../../assets/images/peats00.png'),
  ];
  return (
    <View style={{flex: 1}}>
      <BGAStyle source={BGA[BGN].url} aspect-ratio={1} height={BGA[BGN].height}>
        <DuduImage source={Dudus[BGN]} />
      </BGAStyle>
    </View>
  );
};

const DuduImage = styled.Image`
  position: absolute;
  left: 10;
  bottom: 16;
`;

const BGAStyle = styled.ImageBackground<{height: number}>`
  flex: 1;
  height: ${props => props.height}px;
  width: 100%;
`;

const NavigationButton = styled(View)`
  width: 40px;
  height: 40px;
  background-color: ${props => props.theme.white};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
`;

const NavigationContainer = styled(View)`
  position: absolute;
  top: 20px;
  right: 16px;
  flex-direction: column;
  gap: 12px;
  z-index: 10;
`;

const Navigation = () => {
  const navigation = useNavigation();

  return (
    <NavigationContainer>
      <Pressable
        onPress={() => navigation.navigate('FriendScreen' as never)}
        android_ripple={{color: '#eeeeee'}}>
        <NavigationButton>
          <OcticonIcons name="people" size={24} />
        </NavigationButton>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('SettingScreen' as never)}
        android_ripple={{color: '#eeeeee'}}>
        <NavigationButton>
          <OcticonIcons name="gear" size={24} />
        </NavigationButton>
      </Pressable>
    </NavigationContainer>
  );
};
export default RaceTab;
