import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice';
import exerciseReducer from '../features/exercise/exerciseSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    exercise: exerciseReducer,
  },
});

export default store;
