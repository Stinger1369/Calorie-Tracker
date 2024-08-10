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
          <Stack.Screen name="Welcom" component={Welcom} />
          <Stack.Screen name="AuthChoice" component={AuthChoice} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Logout" component={Logout} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
