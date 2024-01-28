// musicSlice.js
import {createSlice} from '@reduxjs/toolkit';
import Sound from 'react-native-sound';
import {persistSetting} from '../async/asyncStore';

const sound = new Sound('main_bgm.wav', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('Error loading sound: ' + error);
    return;
  }
  sound.setNumberOfLoops(-1);
  sound.play().setVolume(0);
});

export const settingSlice = createSlice({
  name: 'setting',
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
      persistSetting(state);
    },
  },
});

export const {playMusic, stopMusic, setVolume} = settingSlice.actions;

export default settingSlice.reducer;
