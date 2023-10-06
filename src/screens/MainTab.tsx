import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ChallengeScreen from './ChallengeScreen';
import MainScreen from './MainScreen';
import MyPageScreen from './MyPageScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

export const MainTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        // tabBarStyle: {position: 'absolute', borderColor: '#bdbdbd'},
        // tabBarBadgeStyle: {backgroundColor: '#bdbdbd'},
        // tabBarBadgeStyle: {
        //   borderBlockColor: '#D56334',
        //   borderBlockEndColor: '#D56334',
        //   borderBlockStartColor: '#D56334',
        //   borderBottomColor: '#D56334',
        //   borderColor: '#D56334',
        //   borderEndColor: '#D56334',
        //   backgroundColor: '#D56334',
        //   color: '#D56334',

        // },
      }}>
      <Tab.Screen
        name="Main"
        component={ChallengeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Challenge"
        component={MainScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="list_alt" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
