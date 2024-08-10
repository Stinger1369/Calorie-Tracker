import React from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Welcom from './src/pages/Welcom/Welcom';
import Register from './src/pages/Register/Register';
import VerifyEmail from './src/pages/Register/VerifyEmail';
import Home from './src/pages/Home/Home';
import Login from './src/pages/Login/Login';
import Logout from './src/components/Logout/Logout';
import AuthChoice from './src/pages/AuthChoice/AuthChoice';
import ResetPassword from './src/pages/ResetPassword/ResetPassword';

import store from './src/redux/store/store';
import {enableScreens} from 'react-native-screens';

enableScreens();

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcom">
          <Stack.Screen
            name="Welcom"
            component={Welcom}
            options={{ headerShown: false }} // Hide header for Welcom
          />
          <Stack.Screen
            name="AuthChoice"
            component={AuthChoice}
            options={{ headerShown: false }} // Hide header for AuthChoice
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }} // Hide header for Register
          />
          <Stack.Screen
            name="VerifyEmail"
            component={VerifyEmail}
            options={{ headerShown: false }} // Hide header for VerifyEmail
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }} // Hide header for Home
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }} // Hide header for Login
          />
          <Stack.Screen
            name="Logout"
            component={Logout}
            options={{ headerShown: false }} // Hide header for Logout
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{ headerShown: false }} // Hide header for ResetPassword
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
