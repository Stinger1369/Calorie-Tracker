import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import hostname from "../../../hostname";

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Action pour l'enregistrement
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${hostname}/auth/register`, userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${hostname}/auth/login`, userData);
      const user = response.data.user;
      const token = response.data.access_token; // Récupération du token

      // Assurez-vous que l'ID utilisateur et le token sont présents
      if (user && user._id && token) {
        // Sauvegarder l'utilisateur et le token dans AsyncStorage
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({ ...user, id: user._id })
        );
        await AsyncStorage.setItem("token", token);

        console.log(
          "User data and token saved in AsyncStorage:",
          JSON.stringify({ ...user, id: user._id }),
          token
        );
      } else {
        console.error("User ID or token not found in response");
        return rejectWithValue("User ID or token not found");
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred");
    }
  }
);
// Add googleLogin to the authSlice
export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async ({ idToken }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${hostname}/auth/google`, { idToken });

      const user = response.data.user;
      const token = response.data.token;

      // Save user and token in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('token', token);

      return { user, token };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('An error occurred during Google login');
    }
  }
);

// Action pour rafraîchir le token d'accès
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = await AsyncStorage.getItem("refresh_token");
      if (refreshToken) {
        const response = await axios.post(`${hostname}/auth/refresh-token`, {
          refresh_token: refreshToken,
        });
        if (response.data.access_token) {
          await AsyncStorage.setItem("token", response.data.access_token);
          return response.data.access_token;
        } else {
          throw new Error("Failed to refresh access token");
        }
      } else {
        return rejectWithValue("No refresh token found");
      }
    } catch (error) {
      return rejectWithValue("Error refreshing token");
    }
  }
);

// Action pour restaurer le token
export const restoreToken = createAsyncThunk(
  "auth/restoreToken",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");
      if (token && user) {
        const parsedUser = JSON.parse(user);
        return { token, user: parsedUser };
      }
      return rejectWithValue("No token found");
    } catch (error) {
      console.error("Error restoring token:", error);
      return rejectWithValue("Error restoring token");
    }
  }
);

// Action pour vérifier le code de vérification
export const verifyCode = createAsyncThunk(
  "auth/verifyCode",
  async (verificationData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${hostname}/auth/verify-code`,
        verificationData
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

// Action pour demander un nouveau code de vérification
export const requestNewCode = createAsyncThunk(
  "auth/requestNewCode",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${hostname}/auth/request-new-code`, {
        email,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while requesting a new code");
    }
  }
);

// Action pour réinitialiser le mot de passe
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
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
      return rejectWithValue("An error occurred while resetting the password");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state, action) => {
  console.log("Déconnexion en cours, suppression des données...");

  state.user = null;
  state.token = null;

  // Si `saveData` n'est pas vrai, on supprime les données d'AsyncStorage
  if (!action.payload?.saveData) {
    console.log("Suppression des informations dans AsyncStorage...");
    AsyncStorage.removeItem("user");
    AsyncStorage.removeItem("token");
    console.log("Données AsyncStorage supprimées.");
  }
},


    restoreTokenState: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to register";
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to login";
      })
      .addCase(verifyCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyCode.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to verify code";
      })
      .addCase(requestNewCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestNewCode.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(requestNewCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to request new code";
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to reset password";
      })
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to refresh token";
      })
      .addCase(restoreToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(restoreToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to restore token";
      })
      .addCase(googleLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(googleLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    })
    .addCase(googleLogin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to log in with Google';
    });
  },
});

export const { logout, restoreTokenState } = authSlice.actions;
console.log('Actions disponibles:', authSlice.actions);

export default authSlice.reducer;
