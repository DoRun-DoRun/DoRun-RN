import * as React from 'react';
import {AppRegistry} from 'react-native';
import {Provider as StoreProvider} from 'react-redux';
import {name as appName} from './app.json';
import App from './src/App';
import {Store} from './store/Store';
import {NavigationContainer} from '@react-navigation/native';
import {light} from './src/style/theme';
import {ThemeProvider} from 'styled-components/native';
import {QueryClient, QueryClientProvider} from 'react-query';
import CodePush from 'react-native-code-push';

const queryClient = new QueryClient();
import {ModalProvider} from './src/Modal/ModalProvider';
import CustomModal from './src/Modal/CustomModal';
import Toast from 'react-native-toast-message';

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
  installMode: CodePush.InstallMode.IMMEDIATE,
  mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
};

function Main() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider store={Store}>
        <ThemeProvider theme={light}>
          <ModalProvider>
            <NavigationContainer>
              <App />
              <Toast />
              <CustomModal />
            </NavigationContainer>
          </ModalProvider>
        </ThemeProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

AppRegistry.registerComponent(appName, () => CodePush(codePushOptions)(Main));
