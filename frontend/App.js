import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";

import { loadFonts } from "./src/utils/loadFonts";

import Welcom from "./src/pages/Welcom/Welcom";
import Register from "./src/pages/Login/Register/Register";
import VerifyEmail from "./src/pages/Login/Register/VerifyEmail";
import Login from "./src/pages/Login/Login";
import Logout from "./src/components/Logout/Logout";
import AuthChoice from "./src/pages/AuthChoice/AuthChoice";
import ResetPassword from "./src/pages/Login/ResetPassword/ResetPassword";
import TabNavigator from "./src/navigation/TabNavigator";
import ProfileEditNavigator from "./src/pages/ProfileSection/ProfileUpdateEdit/ProfileEditNavigator/ProfileEditNavigator";
import IMCDetails from "./src/pages/ProfileSection/profile/Imc/IMCDetails";

// Import des nouveaux écrans
import Insuffisant from "./src/pages/ProfileSection/profile/Imc/ImcTypes/Insuffisant/Insuffisant";
import Normal from "./src/pages/ProfileSection/profile/Imc/ImcTypes/Normal/Normal";
import Surpoids from "./src/pages/ProfileSection/profile/Imc/ImcTypes/Surpoids/Surpoids";
import Obesite from "./src/pages/ProfileSection/profile/Imc/ImcTypes/Obesite/Obesite";
import RecipeScreen from "./src/pages/ProfileSection/profile/Imc/ImcTypes/RecipeScreen";
import StepsHistoryScreen from "./src/pages/ProfileSection/profile/storyScreen/StepsHistoryScreen";
import BpmHistoryScreen from "./src/pages/ProfileSection/profile/storyScreen/BpmHistoryScreen";
import KcalHistoryScreen from "./src/pages/ProfileSection/profile/storyScreen/KcalHistoryScreen";
import InsuffisantExercice from "./src/pages/ProfileSection/profile/ExerciceApi/InsuffisantExercice";
import NormalExercice from "./src/pages/ProfileSection/profile/ExerciceApi/NormalExercice";
import SurpoidsExercice from "./src/pages/ProfileSection/profile/ExerciceApi/SurpoidsExercice";
import ObesiteExercice from "./src/pages/ProfileSection/profile/ExerciceApi/ObesiteExercice";
import ExerciseDetail from "./src/pages/ProfileSection/profile/ExerciceApi/ExerciseDetail";
import HoroscopeDetailsScreen from "./src/pages/Home/HoroscopeDetails/HoroscopeDetailsScreen";
import store from "./src/redux/store/store";
import { enableScreens } from "react-native-screens";

enableScreens();

const Stack = createNativeStackNavigator();

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadAllFonts() {
      await loadFonts();
      setFontsLoaded(true);
    }
    loadAllFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcom">
          <Stack.Screen
            name="Welcom"
            component={Welcom}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AuthChoice"
            component={AuthChoice}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VerifyEmail"
            component={VerifyEmail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Logout"
            component={Logout}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProfileEdit"
            component={ProfileEditNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="IMCDetails" component={IMCDetails} />

          {/* Ajout des nouveaux écrans */}
          <Stack.Screen name="Insuffisant" component={Insuffisant} />
          <Stack.Screen name="Normal" component={Normal} />
          <Stack.Screen name="Surpoids" component={Surpoids} />
          <Stack.Screen name="Obesite" component={Obesite} />
          <Stack.Screen name="RecipeScreen" component={RecipeScreen} />
          <Stack.Screen name="StepsHistory" component={StepsHistoryScreen} />
          <Stack.Screen name="KcalHistory" component={KcalHistoryScreen} />
          <Stack.Screen name="BpmHistory" component={BpmHistoryScreen} />
          <Stack.Screen
            name="InsuffisantExercice"
            component={InsuffisantExercice}
          />
          <Stack.Screen name="NormalExercice" component={NormalExercice} />
          <Stack.Screen name="SurpoidsExercice" component={SurpoidsExercice} />
          <Stack.Screen name="ObesiteExercice" component={ObesiteExercice} />
          <Stack.Screen name="ExerciseDetail" component={ExerciseDetail} />
          <Stack.Screen name="HoroscopeDetailsScreen" component={HoroscopeDetailsScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
