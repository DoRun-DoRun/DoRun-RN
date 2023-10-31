import * as React from 'react';
import {AppRegistry} from 'react-native';
import {Provider as StoreProvider} from 'react-redux';
import {name as appName} from './app.json';
import App from './src/App';
import {Store} from './store/Store';
import {NavigationContainer} from '@react-navigation/native';

export default function Main() {
  return (
    <StoreProvider store={Store}>
      <NavigationContainer>
        <App />
      </NavigationContainer>
    </StoreProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
