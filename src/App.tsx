/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {RootStack} from './screens/RootStack';
import {ThemeProvider} from 'styled-components';
import {light} from './style/theme';

function App(): JSX.Element {
  return (
    <ThemeProvider theme={light}>
      <RootStack />
    </ThemeProvider>
  );
}

export default App;
