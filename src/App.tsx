import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CreateChallengeScreen from './screens/CreateChallengeScreen';
import {MainTab} from './Tab/MainTab';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import ProfileSettingScreen from './screens/ProfileSettingScreen';
import FriendScreen from './screens/FriendScreen';
import LoginTab from './Tab/LoginTab';
import SettingScreen from './screens/SettingScreen';
import EditChallengeScreen from './screens/EditChallengeScreen';
import TestTab2 from './Tab/TestTab2';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTitle: '',
        // eslint-disable-next-line react/no-unstable-nested-components
        headerLeft: () => (
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={'#1C1B1F'}
            onPress={() => navigation.goBack()}
          />
        ),
      }}>
      <Stack.Screen
        name="TestTab2"
        component={TestTab2}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LoginTab"
        component={LoginTab}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MainTab"
        component={MainTab}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreateChallengeScreen"
        component={CreateChallengeScreen}
      />
      <Stack.Screen
        name="EditChallengeScreen"
        component={EditChallengeScreen}
      />
      <Stack.Screen
        name="ProfileSettingScreen"
        component={ProfileSettingScreen}
      />
      <Stack.Screen name="FriendScreen" component={FriendScreen} />
      <Stack.Screen name="SettingScreen" component={SettingScreen} />
    </Stack.Navigator>
  );
}

export default App;
