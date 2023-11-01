import * as React from 'react';
import {AppRegistry} from 'react-native';
import {Provider as StoreProvider} from 'react-redux';
import {name as appName} from './app.json';
import App from './src/App';
import {Store} from './store/Store';
import {NavigationContainer, ThemeProvider} from '@react-navigation/native';
import {light} from './src/style/theme';

export default function Main() {
  return (
    <StoreProvider store={Store}>
      <ThemeProvider theme={light}>
        <NavigationContainer>
          <App />
        </NavigationContainer>
      </ThemeProvider>
    </StoreProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
