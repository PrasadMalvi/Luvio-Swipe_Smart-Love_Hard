import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import messagesReducer from "./messagesSlice";
import chatReducer from "./chatSlice";

const store = configureStore({
  reducer: {
    auth: authReducer, // Handles authentication (login/logout)
    users: userReducer, // Stores registered users
    messages: messagesReducer, // Stores messages & chats
    chat: chatReducer, // Handles active chat state
  },
});

export default store;
