import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import hostname from "../../../hostname";

// Fonction utilitaire pour obtenir le token JWT depuis le store
const getAuthHeader = (getState) => {
  const token = getState().auth.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const initialState = {
  exercises: [],
  loading: false,
  error: null,
};

// Action pour récupérer les exercices
export const fetchExercises = createAsyncThunk(
  "exerciseApi/fetchExercises",
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await axios.get(
        `${hostname}/api-exercises`,
        getAuthHeader(getState)
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while fetching exercises");
    }
  }
);

// Slice Redux pour les exercices
const exerciseApiSlice = createSlice({
  name: "exerciseApi",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Exercises
      .addCase(fetchExercises.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExercises.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises = action.payload;
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch exercises";
      });
  },
});

export default exerciseApiSlice.reducer;
