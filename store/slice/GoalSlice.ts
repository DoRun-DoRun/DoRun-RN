import {createSlice} from '@reduxjs/toolkit';
import {challengeDataType, persistGoals} from '../async/asyncStore';

const initialState: challengeDataType[] = [];

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    addPersonalGoal: (state, action) => {
      const {challenge_no, newGoal} = action.payload;
      let challenge = state.find(ch => ch.challenge_no === challenge_no);

      if (!challenge) {
        challenge = {
          challenge_no,
          personalGoals: [],
        };
        state.push(challenge);
      }

      challenge.personalGoals.push({...newGoal, id: Date.now()}); // ID 생성을 위해 Date.now() 사용
      persistGoals(state);
      console.log(state);
    },

    toggleGoal: (state, action) => {
      const {challenge_no, goalId} = action.payload;
      const challenge = state.find(ch => ch.challenge_no === challenge_no);
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
    removeGoal: (state, action) => {
      const {challenge_no, goalId} = action.payload;
      const challenge = state.find(ch => ch.challenge_no === challenge_no);
      if (challenge) {
        challenge.personalGoals = challenge.personalGoals.filter(
          goal => goal.id !== goalId,
        );
      }
      persistGoals(state);
      console.log(state);
    },
    updateGoalTitle: (state, action) => {
      const {challenge_no, goalId, newTitle} = action.payload;
      const challenge = state.find(ch => ch.challenge_no === challenge_no);
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
    restoreGoal: (state, action) => {
      return action.payload;
    },
  },
});

export const {
  addPersonalGoal,
  toggleGoal,
  removeGoal,
  updateGoalTitle,
  restoreGoal,
} = goalsSlice.actions;
export default goalsSlice.reducer;
