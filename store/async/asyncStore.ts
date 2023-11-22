import AsyncStorage from '@react-native-async-storage/async-storage';

export interface userDataType {
  UID: number;
  accessToken: string;
  refreshToken: string;
  userName: string;
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
