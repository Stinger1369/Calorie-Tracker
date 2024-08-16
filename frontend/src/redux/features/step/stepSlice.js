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

// Action pour récupérer les pas de l'utilisateur
export const fetchSteps = createAsyncThunk(
  "steps/fetchSteps",
  async (userId, { rejectWithValue, getState }) => {
    try {
      const response = await axios.get(
        `${hostname}/step-count/${userId}`,
        getAuthHeader(getState)
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while fetching steps");
    }
  }
);

// Action pour mettre à jour les pas de l'utilisateur
export const updateSteps = createAsyncThunk(
  "steps/updateSteps",
  async ({ userId, steps, date }, { rejectWithValue, getState }) => {
    try {
      const response = await axios.put(
        `${hostname}/step-count/${userId}`,
        {
          date,
          steps,
        },
        getAuthHeader(getState)
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while updating steps");
    }
  }
);

const stepSlice = createSlice({
  name: "steps",
  initialState: {
    stepsHistory: [], // Historique des pas quotidiens
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSteps.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSteps.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stepsHistory = action.payload;
      })
      .addCase(fetchSteps.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateSteps.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSteps.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Met à jour l'historique avec la nouvelle entrée ou la modifie si elle existe déjà
        const existingEntryIndex = state.stepsHistory.findIndex(
          (entry) =>
            new Date(entry.date).toDateString() ===
            new Date(action.payload.date).toDateString()
        );
        if (existingEntryIndex !== -1) {
          state.stepsHistory[existingEntryIndex] = action.payload;
        } else {
          state.stepsHistory.push(action.payload);
        }
      })
      .addCase(updateSteps.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default stepSlice.reducer;
