import {combineReducers} from '@reduxjs/toolkit';
import UserSlice from './slice/UserSlice';
import IndexSlice from './slice/IndexSlice';

/**
 * 애플리케이션에서 목적에 따라 리듀서를 분리하여 관리 합니다.
 */
const RootReducer = combineReducers({
  user: UserSlice,
  index: IndexSlice,
});

export type RootState = ReturnType<typeof RootReducer>;

export default RootReducer;
