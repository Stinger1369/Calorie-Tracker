import React, { useEffect, useState } from "react";
import { Provider, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View, SafeAreaView, StyleSheet } from "react-native";

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
import InsuffisantExercice from "./src/pages/ProfileSection/profile/ExerciceApi/InsuffisantExercice/InsuffisantExercice";
import NormalExercice from "./src/pages/ProfileSection/profile/ExerciceApi/NormalExercice";
import SurpoidsExercice from "./src/pages/ProfileSection/profile/ExerciceApi/SurpoidsExercice";
import ObesiteExercice from "./src/pages/ProfileSection/profile/ExerciceApi/ObesiteExercice";
import ExerciseDetail from "./src/pages/ProfileSection/profile/ExerciceApi/ExerciseDetail";
import FitnessExercices from './src/pages/ProfileSection/profile/ExerciceApi/FitnessExercice/FitnessExercices';
import ExerciseListScreen from "./src/pages/ProfileSection/profile/ExerciceApi/FitnessExercice/ExerciseListScreen/ExerciseListScreen";
import ExerciseDetailsScreen from "./src/pages/ProfileSection/profile/ExerciceApi/FitnessExercice/ExerciseListScreen/ExerciseDetailsScreen/ExerciseDetailsScreen";
import PolicyScreen from "./src/pages/ProfileSection/profile/PolicyScreen/PolicyScreen";
import StartExerciseScreen from "./src/pages/ProfileSection/profile/ExerciceApi/ExerciceCard/StartExerciceSection/StartExerciseScreen";
import HoroscopeDetailsScreen from "./src/pages/Home/HoroscopeDetails/HoroscopeDetailsScreen";
import RecetteScreen from "./src/pages/Home/RecipeScreen/RecetteScreen";
import ProductDetails from "./src/pages/ScanCode/ProductDetails";
import MembersScreen from "./src/pages/ProfileSection/MembersScreen/MembersScreen";
import MemberProfileScreen from "./src/pages/ProfileSection/profile/MemberProfileScreen.jsx";
import CreateProgramScreen from "./src/pages/ProfileSection/profile/ExerciceApi/CreateProgramScreen/CreateProgramScreen";
import SelectExercisesScreen from "./src/pages/ProfileSection/profile/ExerciceApi/CreateProgramScreen/SelectExercisesScreen";
import ReviewProgramScreen from "./src/pages/ProfileSection/profile/ExerciceApi/CreateProgramScreen/ReviewProgramScreen";

import ScanTabNavigator from './src/navigation/ScanTabNavigator';
import MonthTabNavigator from './src/navigation/MonthTabNavigator';

import store from "./src/redux/store/store";
import { enableScreens } from "react-native-screens";

enableScreens();

const Stack = createNativeStackNavigator();

// AuthStack pour les utilisateurs non connectés
const AuthStackScreen = () => {
  return (
    <Stack.Navigator>

      <Stack.Screen
        name="AuthChoice"
        component={AuthChoice}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="VerifyEmail"
        component={VerifyEmail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const AppStackScreen = () => {
  return (
    <Stack.Navigator>
       <Stack.Screen
              name="Home"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
             <Stack.Screen
              name="Welcom"
              component={Welcom}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="IMCDetails" component={IMCDetails} />
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
            <Stack.Screen name="FitnessExercices" component={FitnessExercices} />
            <Stack.Screen name="ExerciseListScreen" component={ExerciseListScreen} />
            <Stack.Screen name="ExerciseDetails" component={ExerciseDetailsScreen} options={{ title: 'Exercise Details' }} />
            <Stack.Screen name="StartExerciseScreen" component={StartExerciseScreen} />
            <Stack.Screen name="CreateProgramScreen" component={CreateProgramScreen} />
            <Stack.Screen name="PolicyScreen" component={PolicyScreen} />
            <Stack.Screen name="SelectExercisesScreen" component={SelectExercisesScreen} />
             <Stack.Screen
              name="ProfileEdit"
              component={ProfileEditNavigator}
              options={{ headerShown: false }}
            />
             <Stack.Screen name="ReviewProgramScreen" component={ReviewProgramScreen} />

            <Stack.Screen
              name="HoroscopeDetailsScreen"
              component={HoroscopeDetailsScreen}
            />
            <Stack.Screen name="RecetteScreen" component={RecetteScreen} />
            <Stack.Screen
              name="ScanTabs"
              component={ScanTabNavigator}
              options={{ title: "Scanner & Historique" }}
            />
            <Stack.Screen
              name="MonthTabs"
              component={MonthTabNavigator}
              options={{ title: "Programme des mois" }}
            />
            <Stack.Screen name="ProductDetails" component={ProductDetails} />

            <Stack.Screen
              name="MembersScreen"
              component={MembersScreen}
              options={{ title: 'Membres' }}
            />
            <Stack.Screen
              name="MemberProfileScreen"
              component={MemberProfileScreen}
              options={{ title: "Member Profile" }}
            />
    </Stack.Navigator>
  );
};

// Le composant principal vérifie si l'utilisateur est connecté et rend la bonne pile de navigation
const MainApp = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { token } = useSelector((state) => state.auth); // Utiliser useSelector après la configuration du Provider
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function loadAllFonts() {
      await loadFonts();
      setFontsLoaded(true);
    }

    const checkAuth = () => {
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    loadAllFonts();
    checkAuth();
  }, [token]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppStackScreen /> : <AuthStackScreen />}
    </NavigationContainer>
  );
};

// App.js avec le Provider correctement configuré
const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.globalContainer}>
        <MainApp />
      </SafeAreaView>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#1c1c1e", // Assure un fond constant
  },
});