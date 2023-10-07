/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ChallengeScreen from './ChallengeScreen';
import MainScreen from './MainScreen';
import MyPageScreen from './MyPageScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import OcticonIcons from 'react-native-vector-icons/Octicons';
const Tab = createBottomTabNavigator();

export const MainTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#4c4c4c',
        tabBarInactiveTintColor: '#b5b5b5',
      }}>
      <Tab.Screen
        name="챌린지 A"
        component={MainScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <OcticonIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="챌린지 LIST"
        component={ChallengeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="list-alt" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="마이페이지"
        component={MyPageScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <OcticonIcons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
