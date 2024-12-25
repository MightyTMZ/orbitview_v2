'use client'

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
    user: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
    }
    is_private: boolean;
    is_online: boolean;
    bio: string;
    by_line: string;
    date_of_birth: string;
    updated: string;
    created: string;
    image: string; // profile picture URL on the backend CDN
    followers_count: number;
    following_count: number;

}

interface AuthState {
  isAuthenticated: boolean;
  // token: string | null; 
  // NOT storing tokens here
  user: UserProfile | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  // token: null,
  // NOT storing tokens here
  user: null, // not authenticated --> no user to store
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserProfile>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null; // clear the user once they log out
      // state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;