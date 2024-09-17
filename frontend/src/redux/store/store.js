import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import exerciseReducer from "../features/exercise/exerciseSlice";
import recommendationReducer from "../features/recommendation/recommendationSlice";
import stepReducer from "../features/step/stepSlice";
import exerciseApiReducer from "../features/exerciseApi/exerciseApiSlice";
import horiscopeSlice from "../features/horiscopeSlice/horiscopeSlice";
import imageReducer from "../features/imageSlice/imageSlice";
import customProgramReducer from "../features/customProgramExerciceSlice/customProgramExerciceSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    exercise: exerciseReducer,
    recommendations: recommendationReducer,
    steps: stepReducer,
    exerciseApi: exerciseApiReducer,
    horiscope: horiscopeSlice,
    image: imageReducer,
    customProgram: customProgramReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Désactive le middleware pour améliorer les performances
    }),
});

export default store;
