import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import exerciseReducer from "../features/exercise/exerciseSlice";
import recommendationReducer from "../features/recommendation/recommendationSlice";
import stepReducer from "../features/step/stepSlice";
import exerciseApiReducer from "../features/exerciseApi/exerciseApiSlice";
import horiscopeSlice from "../features/horiscopeSlice/horiscopeSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    exercise: exerciseReducer,
    recommendations: recommendationReducer,
    steps: stepReducer,
    exerciseApi: exerciseApiReducer,
    horiscope: horiscopeSlice,
  },
});

export default store;
