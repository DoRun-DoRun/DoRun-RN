import {createSlice} from '@reduxjs/toolkit';
export interface goalType {
  id: number;
  title: string;
  isComplete: boolean;
}

export interface ChallengeGoals {
  challenge_no: number;
  personalGoals: goalType[];
}

const initialState: ChallengeGoals[] = [];

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
    },
    removeGoal: (state, action) => {
      const {challenge_no, goalId} = action.payload;
      const challenge = state.find(ch => ch.challenge_no === challenge_no);
      if (challenge) {
        challenge.personalGoals = challenge.personalGoals.filter(
          goal => goal.id !== goalId,
        );
      }
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
    },
    restore: (state, action) => {
      return action.payload;
    },
  },
});

export const {addPersonalGoal, toggleGoal, removeGoal, updateGoalTitle} =
  goalsSlice.actions;
export default goalsSlice.reducer;
