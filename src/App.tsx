import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainTab} from './screens/MainTab';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <Stack.Navigator screenOptions={{headerBackTitle: '닫기'}}>
      <Stack.Screen
        name="MainTab"
        component={MainTab}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="GoalList"
        component={GoalList}
        options={{title: '챌린지 리스트'}}
      /> */}
    </Stack.Navigator>
  );
}

export default App;
