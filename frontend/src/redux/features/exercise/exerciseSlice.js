import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import hostname from "../../../hostname";

const initialState = {
  exercises: [],
  loading: false,
  error: null,
};

// Action pour récupérer les exercices par userId
export const fetchExercises = createAsyncThunk(
  "exercise/fetchExercises",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${hostname}/exercises/user/${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while fetching exercises");
    }
  }
);

// Action pour créer un nouvel exercice
export const createExercise = createAsyncThunk(
  "exercise/createExercise",
  async (exerciseData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${hostname}/exercises`, exerciseData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while creating the exercise");
    }
  }
);

// Action pour mettre à jour un exercice
export const updateExercise = createAsyncThunk(
  "exercise/updateExercise",
  async ({ exerciseId, updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${hostname}/exercises/${exerciseId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while updating the exercise");
    }
  }
);

// Action pour supprimer un exercice par son ID
export const deleteExercise = createAsyncThunk(
  "exercise/deleteExercise",
  async (exerciseId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${hostname}/exercises/${exerciseId}`
      );
      return exerciseId; // Retourner l'ID de l'exercice supprimé pour pouvoir le retirer de la liste
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while deleting the exercise");
    }
  }
);

// Slice
const exerciseSlice = createSlice({
  name: "exercise",
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
      })
      // Create Exercise
      .addCase(createExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExercise.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises.push(action.payload);
      })
      .addCase(createExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create exercise";
      })
      // Update Exercise
      .addCase(updateExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExercise.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.exercises.findIndex(
          (ex) => ex._id === action.payload._id
        );
        if (index !== -1) {
          state.exercises[index] = action.payload;
        }
      })
      .addCase(updateExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update exercise";
      })
      // Delete Exercise
      .addCase(deleteExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExercise.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises = state.exercises.filter(
          (exercise) => exercise._id !== action.payload
        );
      })
      .addCase(deleteExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete exercise";
      });
  },
});

export default exerciseSlice.reducer;
