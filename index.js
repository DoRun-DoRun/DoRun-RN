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
// import CodePush from 'react-native-code-push';
import 'core-js/stable/atob';

const queryClient = new QueryClient();
import {ModalProvider} from './src/Modal/ModalProvider';
import CustomModal from './src/Modal/CustomModal';
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
} from 'react-native-toast-message';

// const codePushOptions = {
//   checkFrequency: CodePush.CheckFrequency.ON_APP_START,
//   installMode: CodePush.InstallMode.IMMEDIATE,
//   mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
// };

const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#648CF3',
      }}
      text1Style={{
        fontSize: 14,
        fontFamily: 'NotoSansKR-Bold',
        lineHeight: 17.5,
      }}
      text2Style={{
        fontSize: 12,
        fontFamily: 'NotoSansKR-Medium',
        lineHeight: 15,
      }}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 14,
        fontFamily: 'NotoSansKR-Bold',
        lineHeight: 17.5,
      }}
      text2Style={{
        fontSize: 12,
        fontFamily: 'NotoSansKR-Medium',
        lineHeight: 15,
      }}
    />
  ),
  info: props => (
    <InfoToast
      {...props}
      text1Style={{
        fontSize: 14,
        fontFamily: 'NotoSansKR-Bold',
        lineHeight: 17.5,
      }}
      text2Style={{
        fontSize: 12,
        fontFamily: 'NotoSansKR-Medium',
        lineHeight: 15,
      }}
    />
  ),
};

function Main() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider store={Store}>
        <ThemeProvider theme={light}>
          <ModalProvider>
            <NavigationContainer>
              <App />
              <Toast config={toastConfig} />
              <CustomModal />
            </NavigationContainer>
          </ModalProvider>
        </ThemeProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

// AppRegistry.registerComponent(appName, () => CodePush(codePushOptions)(Main));
AppRegistry.registerComponent(appName, () => Main);
