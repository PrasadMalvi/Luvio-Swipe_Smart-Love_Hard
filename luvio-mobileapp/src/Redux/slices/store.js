import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import messagesReducer from "./messagesSlice";
import chatReducer from "./chatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    messages: messagesReducer,
    chat: chatReducer,
  },
});
