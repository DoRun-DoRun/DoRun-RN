import {createSlice} from '@reduxjs/toolkit';

export interface goalType {
  id: number;
  title: string;
  isComplete: boolean;
}

const initialState = {
  goals: [
    {id: 1, title: '한줄이라도 코드 작성하기', isComplete: false},
    {id: 2, title: '1시간씩 자리에 앉아 있기', isComplete: false},
    {id: 3, title: '밥 잘 챙겨먹기', isComplete: false},
    {id: 4, title: '팀 회의 참여하기', isComplete: true},
  ],
};

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    toggleGoal: (state, action) => {
      const targetGoal = state.goals.find(goal => goal.id === action.payload);
      if (targetGoal) {
        targetGoal.isComplete = !targetGoal.isComplete;
      }
    },
    removeGoal: (state, action) => {
      state.goals = state.goals.filter(goal => goal.id !== action.payload);
    },
    updateGoalTitle: (state, action) => {
      const {id, newTitle} = action.payload;
      const newGoal = state.goals.find(goal => goal.id === id);
      if (newGoal) {
        newGoal.title = newTitle;
      }
    },
  },
});

export const {toggleGoal, removeGoal, updateGoalTitle} = goalsSlice.actions;
export default goalsSlice.reducer;
