import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  likedUsers: [],
  dislikedUsers: [],
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    likeUser: (state, action) => {
      state.likedUsers.push(action.payload);
    },
    dislikeUser: (state, action) => {
      state.dislikedUsers.push(action.payload);
    },
  },
});

export const { likeUser, dislikeUser } = matchSlice.actions;
export default matchSlice.reducer;
