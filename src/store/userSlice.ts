import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserState } from '../types';

const initialState: UserState = {
  currentUser: null,
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      }
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
      if (state.currentUser?.id === action.payload) {
        state.currentUser = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentUser,
  setUsers,
  addUser,
  updateUser,
  removeUser,
  setLoading,
  setError,
} = userSlice.actions;

export default userSlice.reducer; 