import {SignType} from '../data';
import {persistUser, userDataType} from './../async/asyncStore';
import {createSlice} from '@reduxjs/toolkit';

// User에서 관리해야하는 Slice

const initialState: userDataType = {
  userName: null,
  accessToken: null,
  isLoggedIn: false,
  UID: null,
  SIGN_TYPE: null,
  USER_EMAIL: null,
  GUEST: null,
  APPLE: null,
  KAKAO: null,
};

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      const response: userDataType = action.payload;

      state.UID = response.UID;
      state.accessToken = response.accessToken;
      state.userName = response.userName;

      state.SIGN_TYPE = response.SIGN_TYPE;

      if (response.GUEST) {
        state.GUEST = response.GUEST;
      }
      if (response.APPLE) {
        state.APPLE = response.APPLE;
      }
      if (response.KAKAO) {
        state.KAKAO = response.KAKAO;
      }

      persistUser(state);
    },
    setUserName(state, action) {
      const {userName} = action.payload;
      state.userName = userName;

      persistUser(state);
    },
    setAccessToken(state, actoin) {
      const response = actoin.payload;

      state.UID = response.UID;
      state.accessToken = response.accessToken;
      state.userName = response.userName;
      state.SIGN_TYPE = response.SIGN_TYPE;
      state.isLoggedIn = true;

      persistUser(state);
    },
    setIsLoggedIn(state) {
      state.isLoggedIn = true;
    },
    logOut(state) {
      state.SIGN_TYPE = null;
      state.isLoggedIn = false;
      persistUser(state);
    },
    signOut(state, action) {
      const {SIGN_TYPE} = action.payload;

      if (SIGN_TYPE === SignType.GUEST) {
        state.GUEST = null;
      }
      if (SIGN_TYPE === SignType.APPLE) {
        state.APPLE = null;
      }
      if (SIGN_TYPE === SignType.KAKAO) {
        state.KAKAO = null;
      }

      state.userName = null;
      state.UID = null;
      state.SIGN_TYPE = null;
      state.accessToken = null;
      state.isLoggedIn = false;
      persistUser(state);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setUser,
  setAccessToken,
  setUserName,
  setIsLoggedIn,
  logOut,
  signOut,
} = UserSlice.actions;

export default UserSlice.reducer;
