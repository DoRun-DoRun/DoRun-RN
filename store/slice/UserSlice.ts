import {persistUser, userDataType} from './../async/asyncStore';
import {createSlice} from '@reduxjs/toolkit';

// User에서 관리해야하는 Slice

const initialState: userDataType = {
  userName: null,
  accessToken: null,
  UID: null,
  SIGN_TYPE: null,
  USER_EMAIL: null,
  GUEST: null,
  APPLE: null,
  KAKAO: null,
};

/**
 * TemplateSlice에서 관리할 상태를 지정합니다.
 */
export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 모든 사용자 정보를 상태에 저장합니다.
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

      console.log('state', state);
      persistUser(state);
    },
    setUserName(state, action) {
      const {userName} = action.payload;
      state.userName = userName;

      persistUser(state);
    },
    setAccessToken(state, actoin) {
      const {accessToken, SIGN_TYPE, UID, userName} = actoin.payload;
      state.UID = UID;
      state.accessToken = accessToken;
      state.userName = userName;
      state.SIGN_TYPE = SIGN_TYPE;
      // console.log(accessToken);
      persistUser(state);
    },
  },
});

// Action creators are generated for each case reducer function
export const {setUser, setAccessToken, setUserName} = UserSlice.actions;

export default UserSlice.reducer;
