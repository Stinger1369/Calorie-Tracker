import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import exerciseReducer from "../features/exercise/exerciseSlice";
import recommendationReducer from "../features/recommendation/recommendationSlice";
import stepReducer from "../features/step/stepSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    exercise: exerciseReducer,
    recommendations: recommendationReducer,
    steps: stepReducer,
  },
});

export default store;
