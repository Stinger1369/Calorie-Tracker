import React from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Welcom from './src/pages/Welcom/Welcom';
import Register from './src/pages/Register/Register';
import VerifyEmail from './src/pages/Register/VerifyEmail';
import Login from './src/pages/Login/Login';
import Logout from './src/components/Logout/Logout';
import AuthChoice from './src/pages/AuthChoice/AuthChoice';
import ResetPassword from './src/pages/ResetPassword/ResetPassword';
import TabNavigator from './src/navigation/TabNavigator';

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
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AuthChoice"
            component={AuthChoice}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="VerifyEmail"
            component={VerifyEmail}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Home"  // Ce nom reste "Home" car il est utilisé pour le TabNavigator.
            component={TabNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Logout"
            component={Logout}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
