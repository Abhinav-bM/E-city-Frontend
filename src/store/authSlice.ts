import { User } from "@/models/user";
import { SLICE_STATUS } from "@/utils/constants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: User.UserState = {
  user: null,
  isAuthenticated: false,
  authCheckComplete: false,
  status: SLICE_STATUS.IDLE,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user?: any; accessToken?: string }>,
    ) => {
      const { user } = action.payload;
      if (user) {
        state.user = user;
      }
      state.status = SLICE_STATUS.SUCCESS;
      state.isAuthenticated = true;
    },
    setAuthCheckComplete: (state) => {
      state.authCheckComplete = true;
    },
    resetUser: () => ({ ...initialState, authCheckComplete: true }),
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = SLICE_STATUS.IDLE;
      // authCheckComplete stays true — we know the user is logged out
    },
  },
});

export const { setUser, logout, resetUser, setAuthCheckComplete } =
  userSlice.actions;

export default userSlice.reducer;
