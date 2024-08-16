import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import hostname from "../../../hostname"; // Assurez-vous d'avoir ce fichier pour gérer l'URL de votre backend

// Fonction utilitaire pour obtenir le nombre de jours dans un mois donné
const getDaysInCurrentMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
};

// Requête pour récupérer toutes les recommandations
export const fetchRecommendations = createAsyncThunk(
  "recommendations/fetchRecommendations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${hostname}/recommendation-food`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while fetching data");
    }
  }
);

// Requête pour récupérer une recommandation par nombre exact de calories
export const fetchRecommendationsByExactCalories = createAsyncThunk(
  "recommendations/fetchRecommendationsByExactCalories",
  async (calories, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${hostname}/recommendation-food/calories/${calories}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while fetching data");
    }
  }
);

// Requête pour récupérer des recommandations par plage de calories
export const fetchRecommendationsByCaloriesRange = createAsyncThunk(
  "recommendations/fetchRecommendationsByCaloriesRange",
  async ({ minCalories, maxCalories }, { rejectWithValue }) => {
    try {
      const daysInMonth = getDaysInCurrentMonth();
      const response = await axios.get(
        `${hostname}/recommendation-food/calories-range`,
        {
          params: { minCalories, maxCalories, limit: daysInMonth, offset: 0 }, // Limite basée sur le nombre de jours dans le mois
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while fetching data");
    }
  }
);

// Requête pour récupérer des recommandations par saison
export const fetchRecommendationsBySeason = createAsyncThunk(
  "recommendations/fetchRecommendationsBySeason",
  async (season, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${hostname}/recommendation-food/season/${season}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while fetching data");
    }
  }
);

// Requête pour récupérer des recommandations par IMC, saison et plage de calories
export const fetchRecommendationsByIMCAndSeason = createAsyncThunk(
  "recommendations/fetchRecommendationsByIMCAndSeason",
  async (
    { classificationIMC, season, minCalories, maxCalories },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${hostname}/recommendation-food/search`,
        { params: { classificationIMC, season, minCalories, maxCalories } }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while fetching data");
    }
  }
);

// Requête pour récupérer une recommandation spécifique par ID
export const fetchRecommendationById = createAsyncThunk(
  "recommendations/fetchRecommendationById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${hostname}/recommendation-food/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred while fetching data");
    }
  }
);

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const recommendationSlice = createSlice({
  name: "recommendations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Pour récupérer toutes les recommandations
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch recommendations";
      })

      // Pour récupérer les recommandations par nombre exact de calories
      .addCase(fetchRecommendationsByExactCalories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRecommendationsByExactCalories.fulfilled,
        (state, action) => {
          state.data = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        fetchRecommendationsByExactCalories.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Failed to fetch recommendations by exact calories";
        }
      )

      // Pour récupérer les recommandations par plage de calories
      .addCase(fetchRecommendationsByCaloriesRange.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRecommendationsByCaloriesRange.fulfilled,
        (state, action) => {
          state.data = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        fetchRecommendationsByCaloriesRange.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Failed to fetch recommendations by calories range";
        }
      )

      // Pour récupérer les recommandations par saison
      .addCase(fetchRecommendationsBySeason.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendationsBySeason.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchRecommendationsBySeason.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch recommendations by season";
      })

      // Pour récupérer les recommandations par IMC et saison
      .addCase(fetchRecommendationsByIMCAndSeason.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRecommendationsByIMCAndSeason.fulfilled,
        (state, action) => {
          state.data = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchRecommendationsByIMCAndSeason.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch recommendations by IMC and season";
      })

      // Pour récupérer une recommandation spécifique par ID
      .addCase(fetchRecommendationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendationById.fulfilled, (state, action) => {
        state.data = [action.payload];
        state.loading = false;
      })
      .addCase(fetchRecommendationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch recommendation by ID";
      });
  },
});

export default recommendationSlice.reducer;
