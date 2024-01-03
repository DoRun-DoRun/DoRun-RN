import AsyncStorage from '@react-native-async-storage/async-storage';
import {SignType} from '../data';

export interface userDataType {
  UID: number | null;
  accessToken: string | null;
  refreshToken: string | null;
  userName: string | null;
  SIGN_TYPE: SignType | null;
  USER_EMAIL: string | null;
}

export interface challengeDataType {
  challenge_mst_no: number;
  personalGoals: goalType[];
}

export interface goalType {
  id: number;
  title: string;
  isComplete: boolean;
}

export interface settingDataType {
  volume: number;
}

export const persistSetting = async (data: settingDataType) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem('setting', jsonValue);
  } catch (e) {
    // saving error
  }
};

export const loadSetting = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('setting');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

export const persistGoals = async (data: challengeDataType[]) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem('goals', jsonValue);
  } catch (e) {
    // saving error
  }
};

export const loadGoals = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('goals');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

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

// export const asyncStorageMiddleware: Middleware<{}, RootState> =
//   store => next => action => {
//     const result = next(action);
//     const newState = store.getState();
//     AsyncStorage.setItem('goals', JSON.stringify(newState.goal));
//     return result;
//   };
