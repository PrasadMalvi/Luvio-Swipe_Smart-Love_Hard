import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: {},
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    sendMessage: (state, action) => {
      const { userId, message } = action.payload;
      if (!state.messages[userId]) {
        state.messages[userId] = [];
      }
      state.messages[userId].push(message);
    },
  },
});

export const { sendMessage } = messageSlice.actions;
export default messageSlice.reducer;
