/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import OcticonIcons from 'react-native-vector-icons/Octicons';

import ChallengeTab from './ChallengeTab';
import RaceTab from './RaceTab';
import MyPageTab from './MyPageTab';

import {useTheme} from 'styled-components/native';

const Tab = createBottomTabNavigator();

export const MainTab = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          borderBottomWidth: 2,
          borderColor: theme.gray6,
        },
        headerTitleStyle: {
          fontFamily: 'NotoSansKR-Medium',
          // fontWeight: '500',
          fontSize: 20,
          lineHeight: 28,
          color: '#000',
        },
        headerTitleAlign: 'center',
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.gray5,
      }}>
      <Tab.Screen
        name="챌린지 이름"
        component={RaceTab}
        options={{
          tabBarIcon: ({color, size}) => (
            <OcticonIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="챌린지 리스트"
        component={ChallengeTab}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="list-alt" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="마이페이지"
        component={MyPageTab}
        options={{
          tabBarIcon: ({color, size}) => (
            <OcticonIcons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
