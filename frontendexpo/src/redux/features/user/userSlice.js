import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import hostname from '../../../hostname';

// Initial state
const initialState = {
  userInfo: null,
  loading: false,
  error: null,
};

// Action pour récupérer les informations de l'utilisateur
export const fetchUserInfo = createAsyncThunk(
  'user/fetchUserInfo',
  async (userId, {rejectWithValue}) => {
    try {
      const response = await axios.get(`${hostname}/users/${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('An error occurred');
    }
  },
);

// Action pour mettre à jour les informations de l'utilisateur
export const updateUserInfo = createAsyncThunk(
  'user/updateUserInfo',
  async ({userId, userData}, {rejectWithValue}) => {
    try {
      const response = await axios.put(`${hostname}/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('An error occurred');
    }
  },
);

// Action pour supprimer un utilisateur
export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId, {rejectWithValue}) => {
    try {
      await axios.delete(`${hostname}/users/${userId}`);
      return userId; // Retourner l'ID de l'utilisateur supprimé
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('An error occurred');
    }
  },
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch User Info
      .addCase(fetchUserInfo.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user info';
      })
      // Update User Info
      .addCase(updateUserInfo.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update user info';
      })
      // Delete User
      .addCase(deleteUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = null; // On pourrait aussi rediriger l'utilisateur après la suppression
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete user';
      });
  },
});

export default userSlice.reducer;
