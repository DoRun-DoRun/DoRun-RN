/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import OcticonIcons from 'react-native-vector-icons/Octicons';

import ChallengeTab from './ChallengeTab';
import RaceTab from './RaceTab';
import MyPageTab from './MyPageTab';

import {useTheme} from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/RootReducer';

const Tab = createBottomTabNavigator();

export const MainTab = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {selectedChallengeMstNo} = useSelector(
    (state: RootState) => state.challenge,
  );
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
        name="챌린지 리스트"
        component={ChallengeTab}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="list-alt" color={color} size={size} />
          ),
          headerRight: () =>
            selectedChallengeMstNo && (
              <TouchableOpacity
                style={{marginRight: 16}}
                onPress={() => {
                  navigation.navigate('EditChallengeScreen' as never);
                }}>
                <OcticonIcons name="pencil" size={24} />
              </TouchableOpacity>
            ),
        }}
      />
      <Tab.Screen
        name="두런두런"
        component={RaceTab}
        options={{
          tabBarIcon: ({color, size}) => (
            <OcticonIcons name="home" color={color} size={size} />
          ),
          headerStyle: {
            backgroundColor: theme.background,
          },
        }}
      />

      <Tab.Screen
        name="마이페이지"
        component={MyPageTab}
        options={{
          tabBarIcon: ({color, size}) => (
            <OcticonIcons name="person" color={color} size={size} />
          ),
          headerRight: () => {
            return (
              <TouchableOpacity
                style={{marginRight: 16}}
                onPress={() => {
                  navigation.navigate('ProfileSettingScreen' as never);
                }}>
                <OcticonIcons name="gear" size={24} />
              </TouchableOpacity>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};
