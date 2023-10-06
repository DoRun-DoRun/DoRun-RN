/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Text, View} from 'react-native';
import {MainTab} from './screens/MainTab';

function App(): JSX.Element {
  return (
    <View>
      <Text>MainScreen</Text>
      <MainTab />
    </View>
  );
}

export default App;
