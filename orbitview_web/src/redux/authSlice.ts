'use client'

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'



interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}


interface UserProfile {
    user: User;
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
  current_user: UserProfile | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  // token: null,
  // NOT storing tokens here
  current_user: null, // not authenticated --> no user to store
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserProfile>) => {
      state.isAuthenticated = true;
      state.current_user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.current_user = null; // clear the user once they log out
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;