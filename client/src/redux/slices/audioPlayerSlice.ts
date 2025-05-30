import { Song } from "@/types/song";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AudioPlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  seektime: number;
}

const initialState: AudioPlayerState = {
  currentSong: null,
  isPlaying: false,
  volume: 1,
  seektime: 0,
};

export const AudioPlayerSlice = createSlice({
  name: "audioPlayer",
  initialState,
  reducers: {
    setCurrentSong(state, action: PayloadAction<Song>) {
      state.currentSong = action.payload;
    },
    togglePlayPause(state) {
      state.isPlaying = !state.isPlaying;
    },
    setPalying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
    setVolume(state, action: PayloadAction<number>) {
      state.volume = action.payload;
    },
    setSeekTime(state, action: PayloadAction<number>) {
      state.seektime = action.payload;
    },
  },
});

export const {
  setCurrentSong,
  togglePlayPause,
  setPalying,
  setVolume,
  setSeekTime,
} = AudioPlayerSlice.actions;

export default AudioPlayerSlice.reducer;
