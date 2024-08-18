import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Action pour récupérer l'horoscope basé sur la date de naissance
export const fetchHoroscope = createAsyncThunk(
  "health/fetchHoroscope",
  async (dateOfBirth, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8000/horoscope`, {
        params: { date_of_birth: dateOfBirth },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Erreur lors de la récupération de l'horoscope"
      );
    }
  }
);

const horiscopeSlice = createSlice({
  name: "health",
  initialState: {
    zodiacSign: "",
    horoscope: null, // Modifié pour s'assurer que la valeur initiale est définie
    bmi: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHoroscope.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHoroscope.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.zodiacSign = action.payload.zodiac_sign;
        state.horoscope = action.payload.horoscope;
      })
      .addCase(fetchHoroscope.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload || "Erreur lors de la récupération de l'horoscope";
      });
  },
});

export default horiscopeSlice.reducer;
