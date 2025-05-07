// src/store/trackPlayerSlice.ts           (JS로 쓰려면 .js로 저장해도 OK)
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import TrackPlayer, {RepeatMode} from 'react-native-track-player';
import {persistSetting} from '../async/asyncStore';

/* -------------------------------------------------------------------------- */
/*  1.  비동기: 최초 한 번 플레이어 세팅                                      */
/* -------------------------------------------------------------------------- */
declare global {
  var __BGM_INITIALIZED__: boolean | undefined;
}

export const initTrackPlayer = createAsyncThunk(
  'setting/init',
  async (_, {getState}) => {
    const {setting} = getState() as {setting: SettingState};
    if (setting.isReady) return;

    await TrackPlayer.setupPlayer();
    await TrackPlayer.add({
      id: 'bgm',
      url: require('../../assets/main_bgm.wav'),
      title: 'BGM',
      artist: '한동준',
    });
    await TrackPlayer.setRepeatMode(RepeatMode.Track);
    // await TrackPlayer.play();
  },
);

/* -------------------------------------------------------------------------- */
/*  2.  Slice 정의                                                             */
/* -------------------------------------------------------------------------- */
export type SettingState = {
  volume: number; // 0.0 ~ 1.0
  isReady: boolean; // 플레이어 세팅 완료 여부
  isPlaying: boolean; // 현재 재생 중?
};

const initialState: SettingState = {
  volume: 1,
  isReady: false,
  isPlaying: false,
};

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    /* 볼륨 조절 ------------------------------------------------------------ */
    setVolume(state, action: PayloadAction<number>) {
      console.log('volume', action.payload);
      state.volume = action.payload;
      TrackPlayer.setVolume(action.payload); // side‑effect
      persistSetting({volume: action.payload}); // 선택: 로컬 저장
    },

    /* 재생·일시정지·정지 ---------------------------------------------------- */
    play(state) {
      TrackPlayer.play();
      state.isPlaying = true;
    },
    pause(state) {
      TrackPlayer.pause();
      state.isPlaying = false;
    },
    stop(state) {
      TrackPlayer.stop();
      state.isPlaying = false;
    },
  },

  /* extraReducers: initTrackPlayer 결과 반영 ------------------------------- */
  extraReducers: builder => {
    builder.addCase(initTrackPlayer.fulfilled, state => {
      state.isReady = true;
    });
  },
});

/* -------------------------------------------------------------------------- */
/*  3.  액션·리듀서 내보내기                                                  */
/* -------------------------------------------------------------------------- */
export const {setVolume, play, pause, stop} = settingSlice.actions;
export default settingSlice.reducer;
