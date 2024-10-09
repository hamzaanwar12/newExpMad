// app/store/userSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userId: string | null;
  username: string;
  userEmail: string;
  token: string;
  profile?:string;
}

const initialState: UserState = {
  userId: null,
  username: "",
  userEmail: "",
  token: "",
  profile:''
};

interface SetUserPayload {
  userId: string;
  username: string;
  userEmail: string;
  token: string;
  profile?:string;
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SetUserPayload>) => {
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.userEmail = action.payload.userEmail;
      state.token = action.payload.token;
    },
    clearUser: (state) => {
      state.userId = null;
      state.username = "";
      state.userEmail = "";
      state.token = "";
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
