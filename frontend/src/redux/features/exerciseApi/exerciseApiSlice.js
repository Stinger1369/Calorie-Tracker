import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import hostname from "../../../hostname"; // Assurez-vous que ce fichier contient l'URL correcte de l'API backend

// Fonction utilitaire pour obtenir le token et le définir dans l'en-tête de la requête
const getAuthHeader = (getState) => {
  const token = getState().auth.token; // Supposons que le token est stocké dans le slice auth
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fonction utilitaire pour obtenir le nombre de jours dans le mois courant
const getDaysInCurrentMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
};

// Fetch all exercises
export const fetchExercises = createAsyncThunk(
  "exerciseApi/fetchExercises",
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await axios.get(
        `${hostname}/fitnessExercice/`, // Ajoutez un '/' ici pour appeler la bonne route
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

// Fetch a random exercise by muscle group
export const fetchRandomExerciseByMuscleGroup = createAsyncThunk(
  "exerciseApi/fetchRandomExerciseByMuscleGroup",
  async (muscleGroup, { rejectWithValue, getState }) => {
    try {
      const response = await axios.get(
        `${hostname}/fitnessExercice/muscleGroup/${muscleGroup}`,
        getAuthHeader(getState)
      );
      const exercises = response.data;
      if (exercises.length > 0) {
        const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
        return { muscleGroup, randomExercise };
      } else {
        return rejectWithValue("No exercises found for this muscle group");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while fetching exercises by muscle group");
    }
  }
);

// Fetch exercises by muscle group
export const fetchExercisesByMuscleGroup = createAsyncThunk(
  "exerciseApi/fetchExercisesByMuscleGroup",
  async (muscleGroup, { rejectWithValue, getState }) => {
    try {
      const response = await axios.get(
        `${hostname}/fitnessExercice/muscleGroup/${muscleGroup}`,
        getAuthHeader(getState)
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while fetching exercises by muscle group");
    }
  }
);

// Fetch exercises by exact calories
export const fetchExercisesByExactCalories = createAsyncThunk(
  "exerciseApi/fetchExercisesByExactCalories",
  async (calories, { rejectWithValue, getState }) => {
    try {
      const response = await axios.get(
        `${hostname}/fitnessExercice/calories/${calories}`,
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

// Fetch exercises by calories range
export const fetchExercisesByCaloriesRange = createAsyncThunk(
  "exerciseApi/fetchExercisesByCaloriesRange",
  async ({ minCalories, maxCalories }, { rejectWithValue, getState }) => {
    try {
      const daysInMonth = getDaysInCurrentMonth();
      const response = await axios.get(
        `${hostname}/fitnessExercice/calories-range`,
        {
          params: { minCalories, maxCalories, limit: daysInMonth, offset: 0 },
          ...getAuthHeader(getState),
        }
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

// Fetch a specific exercise by ID
export const fetchExerciseById = createAsyncThunk(
  "exerciseApi/fetchExerciseById",
  async (id, { rejectWithValue, getState }) => {
    try {
      const response = await axios.get(
        `${hostname}/fitnessExercice/${id}`,
        getAuthHeader(getState)
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while fetching the exercise");
    }
  }
);

// Fetch all muscle groups
export const fetchMuscleGroups = createAsyncThunk(
  "exerciseApi/fetchMuscleGroups",
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await axios.get(
        `${hostname}/fitnessExercice/muscleGroups`,
        getAuthHeader(getState)
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while fetching muscle groups");
    }
  }
);

// État initial
const initialState = {
  data: [], // Stocke les exercices
  muscleGroups: [], // Stocke les groupes musculaires
  randomExercisesByMuscleGroup: {}, // Stocke un exercice aléatoire par groupe musculaire
  loading: false,
  error: null,
};

// Slice
const exerciseApiSlice = createSlice({
  name: "exerciseApi",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Gestion de la récupération des exercices
      .addCase(fetchExercises.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExercises.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch exercises";
      })

      // Gestion de la récupération des groupes musculaires
      .addCase(fetchMuscleGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMuscleGroups.fulfilled, (state, action) => {
        state.muscleGroups = action.payload; // Remplir les groupes musculaires
        state.loading = false;
      })
      .addCase(fetchMuscleGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch muscle groups";
      })

      // Gestion de la récupération d'exercices par groupe musculaire
      .addCase(fetchExercisesByMuscleGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExercisesByMuscleGroup.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchExercisesByMuscleGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch exercises by muscle group";
      })

      // Gestion de la récupération d'un exercice aléatoire par groupe musculaire
      .addCase(fetchRandomExerciseByMuscleGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRandomExerciseByMuscleGroup.fulfilled, (state, action) => {
        const { muscleGroup, randomExercise } = action.payload;
        state.randomExercisesByMuscleGroup[muscleGroup] = randomExercise; // Stocker l'exercice aléatoire
        state.loading = false;
      })
      .addCase(fetchRandomExerciseByMuscleGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch random exercise by muscle group";
      });
  },
});

export default exerciseApiSlice.reducer;
