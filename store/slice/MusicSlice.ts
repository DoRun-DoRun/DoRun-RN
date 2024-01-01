// musicSlice.js
import {createSlice} from '@reduxjs/toolkit';
import Sound from 'react-native-sound';

const sound = new Sound('main_bgm.wav', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('Error loading sound: ' + error);
    return;
  }
});

export const musicSlice = createSlice({
  name: 'music',
  initialState: {volume: 1},
  reducers: {
    playMusic: state => {
      sound.setNumberOfLoops(-1);
      sound.setVolume(state.volume);
      sound.play();
    },
    stopMusic: () => {
      sound.stop();
    },
    setVolume: (state, action) => {
      const volume = action.payload.volume;
      if (sound && volume != null) {
        sound.setVolume(volume);
        state.volume = volume;
      }
    },
  },
});

export const {playMusic, stopMusic, setVolume} = musicSlice.actions;

export default musicSlice.reducer;
