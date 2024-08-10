import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import hostname from '../../../hostname';

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Action pour l'enregistrement
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, {rejectWithValue}) => {
    try {
      const response = await axios.post(`${hostname}/auth/register`, userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('An error occurred');
    }
  },
);

// Action pour la connexion
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, {rejectWithValue}) => {
    try {
      const response = await axios.post(`${hostname}/auth/login`, userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('An error occurred');
    }
  },
);

// Action pour vérifier le code de vérification
export const verifyCode = createAsyncThunk(
  'auth/verifyCode',
  async (verificationData, {rejectWithValue}) => {
    try {
      const response = await axios.post(
        `${hostname}/auth/verify-code`,
        verificationData,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('An error occurred');
    }
  },
);

// Action pour demander un nouveau code de vérification
export const requestNewCode = createAsyncThunk(
  'auth/requestNewCode',
  async (email, {rejectWithValue}) => {
    try {
      const response = await axios.post(`${hostname}/auth/request-new-code`, {
        email,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('An error occurred while requesting a new code');
    }
  },
);

// Action pour réinitialiser le mot de passe
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({token, newPassword}, {rejectWithValue}) => {
    try {
      const response = await axios.post(`${hostname}/auth/reset-password`, {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('An error occurred while resetting the password');
    }
  },
);
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
  },
  reducers: {
    logout: (state, action) => {
      state.user = null;
      state.token = null;
      if (!action.payload.saveData) {
        AsyncStorage.removeItem('user');
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, state => {
        state.loading = false;
        // Aucune mise à jour de l'AsyncStorage ici
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to register';
      })
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        // Stocker les données de l'utilisateur uniquement après une connexion réussie
        AsyncStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to login';
      })
      .addCase(verifyCode.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyCode.fulfilled, state => {
        state.loading = false;
        // Logic to handle verification success if needed
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to verify code';
      })
      .addCase(requestNewCode.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestNewCode.fulfilled, state => {
        state.loading = false;
        // Logic to handle requestNewCode success if needed
      })
      .addCase(requestNewCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to request new code';
      })
      .addCase(resetPassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, state => {
        state.loading = false;
        // Logic to handle resetPassword success if needed
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to reset password';
      });
  },
});

export const {logout} = authSlice.actions;

export default authSlice.reducer;
