import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CreateChallengeScreen from './screens/CreateChallengeScreen';
import {MainTab} from './Tab/MainTab';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

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
        name="MainTab"
        component={MainTab}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreateChallengeScreen"
        component={CreateChallengeScreen}
      />
    </Stack.Navigator>
  );
}

export default App;
