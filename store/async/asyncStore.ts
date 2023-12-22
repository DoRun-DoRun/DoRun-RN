import AsyncStorage from '@react-native-async-storage/async-storage';
import {goalType} from '../slice/GoalSlice';
import {Middleware} from 'redux';
import {RootState} from '../RootReducer';

export interface userDataType {
  UID: number | null;
  accessToken: string | null;
  refreshToken: string | null;
  userName: string | null;
}

export interface challengeDataType {
  challenge_no: number;
  personalGoals: goalType[];
}

export const persistUser = async (data: userDataType) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem('user', jsonValue);
  } catch (e) {
    // saving error
  }
};

export const loadUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('user');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

export const asyncStorageMiddleware: Middleware<{}, RootState> =
  store => next => action => {
    const result = next(action);
    const newState = store.getState();
    AsyncStorage.setItem('goals', JSON.stringify(newState.goal));
    return result;
  };
