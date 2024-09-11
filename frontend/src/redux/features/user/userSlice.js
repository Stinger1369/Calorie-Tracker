import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import hostname from "../../../hostname";

// Fonction utilitaire pour obtenir le token JWT depuis le store
const getAuthHeader = (getState) => {
  const token = getState().auth.token;
  if (!token) {
    console.error("No token found in state");
  } else {
    console.log("Token found:", token);
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const initialState = {
  userInfo: null,
  userId: null,
  age: null,
  bmi: null,
  recommendedCalories: null,
  loading: false,
  error: null,
};

// Action pour récupérer le userId depuis AsyncStorage
export const fetchUserId = createAsyncThunk(
  "user/fetchUserId",
  async (_, { rejectWithValue }) => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        return parsedUser.id;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user ID from AsyncStorage:", error);
      return rejectWithValue("Failed to fetch user ID from AsyncStorage");
    }
  }
);

// Action pour récupérer les informations de l'utilisateur
export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async (userId, { rejectWithValue, getState }) => {
    try {
      console.log(`Fetching user info for userId: ${userId}`);
      const response = await axios.get(
        `${hostname}/users/${userId}`,
        getAuthHeader(getState)
      );
      console.log("User info fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error fetching user info:", error.response.data);
        return rejectWithValue(error.response.data.message);
      }
      console.error("Unknown error fetching user info:", error);
      return rejectWithValue("An error occurred while fetching user info");
    }
  }
);

// Action pour mettre à jour les informations de l'utilisateur
export const updateUserInfo = createAsyncThunk(
  "user/updateUserInfo",
  async ({ userId, userData }, { rejectWithValue, getState }) => {
    try {
      const response = await axios.put(
        `${hostname}/users/${userId}`,
        userData,
        getAuthHeader(getState)
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred");
    }
  }
);

// Action pour supprimer un utilisateur
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId, { rejectWithValue, getState }) => {
    try {
      await axios.delete(
        `${hostname}/users/${userId}`,
        getAuthHeader(getState)
      );
      return userId; // Retourner l'ID de l'utilisateur supprimé
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred");
    }
  }
);

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Ajouter des reducers personnalisés si nécessaire
  },
  extraReducers: (builder) => {
    builder
      // Fetch User ID
      .addCase(fetchUserId.fulfilled, (state, action) => {
        state.userId = action.payload;
      })
      // Fetch User Info
      .addCase(fetchUserInfo.pending, (state) => {
        console.log("Fetching user info... (pending)");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        console.log("User info fetched successfully (fulfilled):", action.payload);
        state.loading = false;
        state.userInfo = action.payload;
        state.age = action.payload.age;
        state.bmi = action.payload.bmi;
        state.recommendedCalories = action.payload.recommendedCalories;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        console.error("Failed to fetch user info (rejected):", action.payload);
        state.loading = false;
        state.error = action.payload || "Failed to fetch user info";
      })
      // Update User Info
      .addCase(updateUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.age = action.payload.age;
        state.bmi = action.payload.bmi;
        state.recommendedCalories = action.payload.recommendedCalories;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user info";
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = null;
        state.userId = null;
        state.age = null;
        state.bmi = null;
        state.recommendedCalories = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete user";
      });
  },
});

export default userSlice.reducer;
