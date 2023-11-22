import {createSlice} from '@reduxjs/toolkit';

// User에서 관리해야하는 Slice
const initialState = {
  name: null,
  accessToken: null,
  refreshToken: null,
  UID: null,
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
      const {name, UID, accessToken, refreshToken} = action.payload;
      state.name = name;
      state.UID = UID;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setUser} = UserSlice.actions;

export default UserSlice.reducer;
