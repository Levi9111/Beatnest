"use client";

import { baseApi } from "./baseApi";

export const uploadSongApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadSong: builder.mutation({
      query: (formdata) => ({
        url: "songs/create",
        method: "POST",
        body: formdata,
      }),
    }),

    getAllSongs: builder.query({
      query: () => "songs",
    }),
  }),
});

export const { useUploadSongMutation, useGetAllSongsQuery } = uploadSongApi;
