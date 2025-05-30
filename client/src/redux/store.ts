"use client";
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import authReducer from "./slices/authSlice";
import audioPlayerReduces from "./slices/audioPlayerSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { persistStore } from "redux-persist";

const persistAuthConfig = {
  key: "auth",
  storage,
  whitelist: ["accessToken"],
};

const persistAudioPlayerConfig = {
  key: "audioPlayer",
  storage,
  whitelist: ["currentSong", "volume"],
};

const persistedAuthReducer = persistReducer(persistAuthConfig, authReducer);

const persistedAudioPlayerReducer = persistReducer(
  persistAudioPlayerConfig,
  audioPlayerReduces
);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedAuthReducer,
    audioPlayer: persistedAudioPlayerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
