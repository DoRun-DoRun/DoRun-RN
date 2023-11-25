import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {HomeContainer} from '../Component';
import {useNavigation} from '@react-navigation/native';
import OcticonIcons from 'react-native-vector-icons/Octicons';
import styled from 'styled-components';
import {TryModal} from '../Modal/MyDailyDiaryModal';
import {ChallengeModal} from '../Modal/ChallengeListModal';
const RaceTab = () => {
  return (
    <HomeContainer>
      <Text>RaceTab</Text>
      <TryModal />
      <ChallengeModal />
      <Navigation />
    </HomeContainer>
  );
};

const NavigationButton = styled(View)`
  width: 40px;
  height: 40px;
  background-color: ${props => props.theme.white};
  shadow-color: rgba(0, 0, 0, 0.3);
  shadow-offset: 1px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 3px;
  elevation: 4;
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
