import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    activeChat: null, // Stores selected user chat
  },
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    clearChat: (state) => {
      state.activeChat = null;
    },
  },
});

export const { setActiveChat, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
