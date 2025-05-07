import {combineReducers} from '@reduxjs/toolkit';
import ChallengeSlice from './slice/ChallengeSlice';
import GoalSlice from './slice/GoalSlice';
import SettingSlice from './slice/SettingSlice';
import UserSlice from './slice/UserSlice';

/**
 * 애플리케이션에서 목적에 따라 리듀서를 분리하여 관리 합니다.
 */
const RootReducer = combineReducers({
  user: UserSlice,
  goal: GoalSlice,
  challenge: ChallengeSlice,
  setting: SettingSlice,
});

export type RootState = ReturnType<typeof RootReducer>;

export default RootReducer;
