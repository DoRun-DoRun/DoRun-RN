import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import {AppRegistry} from 'react-native';
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
} from 'react-native-toast-message';
import {QueryClient, QueryClientProvider} from 'react-query';
import {Provider as StoreProvider} from 'react-redux';
import {name as appName} from './app.json';
import App from './src/App';
import CustomModal from './src/Modal/CustomModal';
import {ModalProvider} from './src/Modal/ModalProvider';
import {ThemeProvider} from './src/theme/ThemeProvider';
import {light} from './src/theme/palette';
import {Store} from './store/Store';

// import CodePush from 'react-native-code-push';
// import 'core-js/stable/atob';

const queryClient = new QueryClient();

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
        top: 32,
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
        <ThemeProvider value={light}>
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
