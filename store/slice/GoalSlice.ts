import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {challengeDataType, persistGoals} from '../async/asyncStore';
import {SignType} from '../data';

interface goalType {
  title: string;
  isComplete: boolean;
}

const initialState: challengeDataType = {APPLE: [], GUEST: [], KAKAO: []};

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    addPersonalGoal: (
      state,
      action: PayloadAction<{
        type: SignType;
        challenge_mst_no: number;
        newGoal: goalType;
      }>,
    ) => {
      const {type, challenge_mst_no, newGoal} = action.payload;

      let challenge = state[type].find(
        ch => ch.challenge_mst_no === challenge_mst_no,
      );

      if (!challenge) {
        challenge = {
          challenge_mst_no,
          personalGoals: [],
        };
        state[type].push(challenge);
      }

      challenge.personalGoals.push({...newGoal, id: Date.now()}); // ID 생성을 위해 Date.now() 사용
      persistGoals(state);
      console.log(state);
    },

    toggleGoal: (
      state,
      action: PayloadAction<{
        type: SignType;
        challenge_mst_no: number;
        goalId: number;
      }>,
    ) => {
      const {type, challenge_mst_no, goalId} = action.payload;
      const challenge = state[type].find(
        ch => ch.challenge_mst_no === challenge_mst_no,
      );
      if (challenge) {
        const targetGoal = challenge.personalGoals.find(
          goal => goal.id === goalId,
        );
        if (targetGoal) {
          targetGoal.isComplete = !targetGoal.isComplete;
        }
      }
      persistGoals(state);
      console.log(state);
    },
    removeGoal: (
      state,
      action: PayloadAction<{
        type: SignType;
        challenge_mst_no: number;
        goalId: number;
      }>,
    ) => {
      const {type, challenge_mst_no, goalId} = action.payload;
      const challenge = state[type].find(
        ch => ch.challenge_mst_no === challenge_mst_no,
      );
      if (challenge) {
        challenge.personalGoals = challenge.personalGoals.filter(
          goal => goal.id !== goalId,
        );
      }
      persistGoals(state);
      console.log(state);
    },
    updateGoalTitle: (
      state,
      action: PayloadAction<{
        type: SignType;
        challenge_mst_no: number;
        goalId: number;
        newTitle: string;
      }>,
    ) => {
      const {type, challenge_mst_no, goalId, newTitle} = action.payload;
      const challenge = state[type].find(
        ch => ch.challenge_mst_no === challenge_mst_no,
      );
      if (challenge) {
        const targetGoal = challenge.personalGoals.find(
          goal => goal.id === goalId,
        );
        if (targetGoal) {
          targetGoal.title = newTitle;
        }
      }
      persistGoals(state);
      console.log(state);
    },

    removeChallenge: (
      state,
      action: PayloadAction<{
        type: SignType;
        challenge_mst_no: number;
      }>,
    ) => {
      const {type, challenge_mst_no} = action.payload;

      const index = state[type].findIndex(
        challenge => challenge.challenge_mst_no === challenge_mst_no,
      );
      if (index !== -1) {
        state[type].splice(index, 1);
      }

      persistGoals(state);
      console.log(state);
    },
    restoreGoal: (state, action) => {
      return action.payload;
    },
    resetGoals: (
      state,
      action: PayloadAction<{
        type: SignType;
        challenge_mst_no: number;
      }>,
    ) => {
      const {type, challenge_mst_no} = action.payload;
      const challenge = state[type].find(
        ch => ch.challenge_mst_no === challenge_mst_no,
      );
      if (challenge) {
        challenge.personalGoals.map(goal => {
          goal.isComplete = false;
        });
      }
      persistGoals(state);
      console.log(state);
    },
  },
});

export const {
  addPersonalGoal,
  toggleGoal,
  removeGoal,
  updateGoalTitle,
  restoreGoal,
  removeChallenge,
  resetGoals,
} = goalsSlice.actions;
export default goalsSlice.reducer;
