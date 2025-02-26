import { createSlice } from "@reduxjs/toolkit";
import { setAuthToken } from "./axiosSlice"; // ✅ Import setAuthToken

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      // ✅ Update Axios with token
      setAuthToken(action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // ✅ Remove token from Axios
      setAuthToken(null);
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
