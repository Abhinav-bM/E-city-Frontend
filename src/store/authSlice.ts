import { User } from "@/models/user";
import { SLICE_STATUS } from "@/utils/constants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { boolean, string } from "yup";

const initialState: User.UserState = {
  user: null,
  isAuthenticated: false,
  status: SLICE_STATUS.IDLE,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user?: any; accessToken: string }>,
    ) => {
      const { user, accessToken } = action.payload;
      if (user) {
        state.user = user;
      } else if (state.user) {
        state.user.access = accessToken;
      }
      state.status = SLICE_STATUS.SUCCESS;
      state.isAuthenticated = true;
    },
    resetUser: () => initialState,
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = SLICE_STATUS.IDLE;
      // Note: Token cleanup is handled in Auth.logout() and logout API call
    },
  },
});

export const { setUser, logout, resetUser } = userSlice.actions;

export default userSlice.reducer;
