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

const queryClient = new QueryClient();
import {ModalProvider} from './src/Modal/ModalProvider';
import CustomModal from './src/Modal/CustomModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function Main() {
  React.useEffect(() => {
    const loadGoals = async () => {
      const storedGoals = await AsyncStorage.getItem('goals');
      if (storedGoals) {
        const parsedGoals = JSON.parse(storedGoals);
        Store.dispatch({type: 'goals/restore', payload: parsedGoals});
      }
    };

    loadGoals();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider store={Store}>
        <ThemeProvider theme={light}>
          <ModalProvider>
            <NavigationContainer>
              <CustomModal />
              <App />
              <Toast />
            </NavigationContainer>
          </ModalProvider>
        </ThemeProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
