import { User } from "@/models/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { boolean, string } from "yup";

const initialState: User = {
  accessToken: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.accessToken = action.payload.accessToken;
    },
    logout: (state) => {
      state.accessToken = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer
