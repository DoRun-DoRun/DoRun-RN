import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ChallengeScreen from './ChallengeScreen';
import MainScreen from './MainScreen';
import MyPageScreen from './MyPageScreen';

const Tab = createBottomTabNavigator();

export const MainTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
      }}>
      <Tab.Screen name="Main" component={ChallengeScreen} />
      <Tab.Screen name="Challenge" component={MainScreen} />
      <Tab.Screen name="MyPage" component={MyPageScreen} />
    </Tab.Navigator>
  );
};
