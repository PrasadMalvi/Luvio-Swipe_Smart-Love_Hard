import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  likedUsers: [],
  dislikedUsers: [],
  superLikedUsers: [], // Add superLikedUsers to initialState
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
    superLikeUser: (state, action) => {
      // Add superLikeUser reducer
      state.superLikedUsers.push(action.payload);
    },
  },
});

export const { likeUser, dislikeUser, superLikeUser } = matchSlice.actions; // Export superLikeUser
export default matchSlice.reducer;
