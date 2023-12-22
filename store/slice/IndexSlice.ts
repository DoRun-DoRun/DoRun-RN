import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  index: 0,
};

export const IndexSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    increaseIndex(state) {
      state.index += 1;
    },
    decreaseIndex(state) {
      state.index -= 1;
    },
    resetIndex(state) {
      state.index = 0;
    },
  },
});

// Action creators are generated for each case reducer function
export const {increaseIndex, decreaseIndex, resetIndex} = IndexSlice.actions;

export default IndexSlice.reducer;
