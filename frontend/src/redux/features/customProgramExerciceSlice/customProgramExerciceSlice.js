import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import hostname from "../../../hostname"; // Assuming you have a hostname file for your API base URL

// Utility function to get the authorization header
const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token"); // Fetching the token from AsyncStorage
  if (!token) {
    console.error("No token found in AsyncStorage");
    return {};
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Action to create a new custom program
export const createCustomProgram = createAsyncThunk(
  "customProgram/create",
  async (programData, { rejectWithValue }) => {
    try {
      const authHeader = await getAuthHeader(); // Get the token for authorization
      const response = await axios.post(
        `${hostname}/custom-programs-exercice`,
        programData,
        authHeader // Pass the token in the request
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while creating the custom program.");
    }
  }
);

// Action to fetch all programs for a user
export const fetchUserPrograms = createAsyncThunk(
  "customProgram/fetchByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const authHeader = await getAuthHeader();
      const response = await axios.get(
        `${hostname}/custom-programs-exercice/${userId}`,
        authHeader
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while fetching user programs.");
    }
  }
);

// Action to update a custom program
export const updateCustomProgram = createAsyncThunk(
  "customProgram/update",
  async ({ userId, programId, updateData }, { rejectWithValue }) => {
    try {
      const authHeader = await getAuthHeader();
      const response = await axios.patch(
        `${hostname}/custom-programs-exercice/${programId}`,
        updateData,
        authHeader
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while updating the custom program.");
    }
  }
);

const customProgramExerciceSlice = createSlice({
  name: "customProgram",
  initialState: {
    programs: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCustomProgram.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCustomProgram.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.programs.push(action.payload);
      })
      .addCase(createCustomProgram.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchUserPrograms.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserPrograms.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.programs = action.payload;
      })
      .addCase(fetchUserPrograms.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateCustomProgram.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCustomProgram.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.programs.findIndex(
          (program) => program._id === action.payload._id
        );
        if (index !== -1) {
          state.programs[index] = action.payload;
        }
      })
      .addCase(updateCustomProgram.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default customProgramExerciceSlice.reducer;
