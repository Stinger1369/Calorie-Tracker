import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer, // Ajout du userReducer
  },
});

export default store;
