import {createSlice} from '@reduxjs/toolkit';

// User에서 관리해야하는 Slice
const initialState = {
  name: '',
  nickName: '',
  email: '',
  accessToken: '',
};

/**
 * TemplateSlice에서 관리할 상태를 지정합니다.
 */
export const TemplateUserSlice = createSlice({
  name: 'templateUser',
  initialState,
  reducers: {
    // 모든 사용자 정보를 상태에 저장합니다.
    setUser(state, action) {
      state.name = action.payload.name;
      state.nickName = action.payload.nickName;
      state.email = action.payload.email;
      state.accessToken = action.payload.accessToken;
    },

    // 사용자 이름을 상태에 저장합니다.
    setName(state, action) {
      state.name = action.payload;
    },

    // 닉네임을 상태에 저장합니다.
    setNickName(state, action) {
      state.nickName = action.payload;
    },

    // 사용자 이메일을 상태에 저장합니다.
    setEmail(state, action) {
      state.email = action.payload;
    },

    // 접근 토큰을 상태에 저장합니다.
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setUser, setName, setNickName, setEmail, setAccessToken} =
  TemplateUserSlice.actions;

export default TemplateUserSlice.reducer;
