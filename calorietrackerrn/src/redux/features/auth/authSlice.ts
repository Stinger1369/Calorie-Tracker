// src/redux/features/auth/authSlice.ts
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import hostname from '../../../hostname'; // Importation de l'hostname

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  // Ajoutez d'autres champs si nécessaire
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Action pour l'enregistrement
export const registerUser = createAsyncThunk<
  {user: User; access_token: string},
  Omit<User, 'access_token'>,
  {rejectValue: string}
>('auth/registerUser', async (userData, {rejectWithValue}) => {
  try {
    const response = await axios.post(
      `${hostname}/auth/register`, // Utilisation de l'hostname
      userData,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue('An error occurred');
  }
});

// Action pour la connexion
export const loginUser = createAsyncThunk<
  {user: User; access_token: string},
  {email: string; password: string},
  {rejectValue: string}
>('auth/loginUser', async (userData, {rejectWithValue}) => {
  try {
    const response = await axios.post(
      `${hostname}/auth/login`, // Utilisation de l'hostname
      userData,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue('An error occurred');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<{user: User; access_token: string}>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.access_token;
        },
      )
      .addCase(
        registerUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || 'Failed to register';
        },
      )
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{user: User; access_token: string}>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.access_token;
        },
      )
      .addCase(
        loginUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || 'Failed to login';
        },
      );
  },
});

export const {logout} = authSlice.actions;

export default authSlice.reducer;
