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
  isProfileIncomplete: false, // Ajout de l'état pour le profil incomplet
};

// Action pour récupérer le userId depuis AsyncStorage
export const fetchUserId = createAsyncThunk(
  "user/fetchUserId",
  async (_, { rejectWithValue }) => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        return parsedUser._id;
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
  async ({ userId, source }, { rejectWithValue, getState }) => {
    const state = getState();
    const token = state.auth.token;

    console.log(`État actuel du store au moment de l'appel depuis ${source}:`, state);

    if (!token) {
      console.error(`Aucun token trouvé dans le state lors de l'appel fetchUserInfo depuis : ${source}`);
      return rejectWithValue("Le token est manquant");
    }

    try {
      console.log(`Récupération des informations utilisateur pour userId: ${userId}, depuis: ${source}`);
      const response = await axios.get(
        `${hostname}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(`Informations utilisateur récupérées avec succès depuis: ${source}`, response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(`Erreur lors de la récupération des informations utilisateur depuis: ${source}`, error.response.data);
        return rejectWithValue(error.response.data.message);
      }
      console.error(`Erreur inconnue lors de la récupération des informations utilisateur depuis: ${source}`, error);
      return rejectWithValue("Une erreur est survenue lors de la récupération des informations utilisateur");
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
// Action pour récupérer uniquement certains champs de l'utilisateur
export const fetchUserInfoWithFields = createAsyncThunk(
  "user/fetchUserInfoWithFields",
  async ({ userId, fields }, { rejectWithValue, getState }) => {
    try {
      console.log(`Fetching user info for userId: ${userId} with fields: ${fields}`);
      const response = await axios.get(
        `${hostname}/users/${userId}?fields=${fields.join(',')}`,
        getAuthHeader(getState)
      );
      console.log("User info fetched successfully with fields:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error fetching user info fetchUserInfoWithFields:", error.response.data);
        return rejectWithValue(error.response.data.message);
      }
      console.error("Unknown error fetching user info fetchUserInfoWithFields:", error);
      return rejectWithValue("An error occurred while fetching user info");
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
// Action to fetch all users
export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await axios.get(
        `${hostname}/users`, // Assuming this endpoint fetches all users
        getAuthHeader(getState)
      );
      return response.data; // Return the list of users
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while fetching users");
    }
  }
);

// Action pour accepter/refuser la politique
export const updatePolicyAcceptance = createAsyncThunk(
  "user/updatePolicyAcceptance",
  async ({ userId, hasAcceptedPolicy }, { rejectWithValue, getState }) => {
    try {
      const response = await axios.put(
        `${hostname}/users/${userId}/accept-policy`, // API route to update policy acceptance
        { hasAcceptedPolicy },
        getAuthHeader(getState)
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while updating policy acceptance");
    }
  }
);

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
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

        // Vérifier si les informations essentielles sont manquantes (taille, poids, genre, date de naissance)
        if (!action.payload.height || !action.payload.weight || !action.payload.dateOfBirth || !action.payload.gender) {
          state.isProfileIncomplete = true;
        } else {
          state.isProfileIncomplete = false;
        }
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        console.error("Failed to fetch user info (rejected):", action.payload);
        state.loading = false;
        state.error = action.payload || "Failed to fetch user info";
      })
      .addCase(fetchUserInfoWithFields.pending, (state) => {
        console.log("Fetching user info with specific fields... (pending)");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfoWithFields.fulfilled, (state, action) => {
        console.log("User info fetched successfully with specific fields (fulfilled):", action.payload);
        state.loading = false;
        state.userInfo = {
          ...state.userInfo,
          ...action.payload, // Met à jour uniquement les champs spécifiés
        };
      })
      .addCase(fetchUserInfoWithFields.rejected, (state, action) => {
        console.error("Failed to fetch user info with specific fields (rejected):", action.payload);
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

        // Vérifier à nouveau si les informations essentielles sont complètes après la mise à jour
        if (!action.payload.height || !action.payload.weight || !action.payload.dateOfBirth || !action.payload.gender) {
          state.isProfileIncomplete = true;
        } else {
          state.isProfileIncomplete = false;
        }
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
      })
      .addCase(fetchAllUsers.pending, (state) => {
      console.log("Fetching all users... (pending)");
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchAllUsers.fulfilled, (state, action) => {
      console.log("Users fetched successfully (fulfilled):", action.payload);
      state.loading = false;
      state.members = action.payload; // Update state with fetched users
    })
    .addCase(fetchAllUsers.rejected, (state, action) => {
      console.error("Failed to fetch users (rejected):", action.payload);
      state.loading = false;
      state.error = action.payload || "Failed to fetch users";
    })
     .addCase(updatePolicyAcceptance.pending, (state) => {
        console.log("Updating policy acceptance... (pending)");
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePolicyAcceptance.fulfilled, (state, action) => {
        console.log("Policy acceptance updated successfully (fulfilled):", action.payload);
        state.loading = false;
        state.userInfo = {
          ...state.userInfo,
          hasAcceptedPolicy: action.payload.hasAcceptedPolicy, // Met à jour le statut de la politique dans le state
        };
      })
      .addCase(updatePolicyAcceptance.rejected, (state, action) => {
        console.error("Failed to update policy acceptance (rejected):", action.payload);
        state.loading = false;
        state.error = action.payload || "Failed to update policy acceptance";
      });
  },
});

export default userSlice.reducer;
