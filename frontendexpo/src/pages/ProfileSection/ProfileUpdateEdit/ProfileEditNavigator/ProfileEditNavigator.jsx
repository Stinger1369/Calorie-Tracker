import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BasicInfoScreen from "../BasicInfoScreen/BasicInfoScreen";
import HealthInfoScreen from "../HealthInfoScreen/HealthInfoScreen";
import LifestyleInfoScreen from "../LifestyleInfoScreen/LifestyleInfoScreen";
import HabitsPreferencesScreen from "../HabitsPreferencesScreen/HabitsPreferencesScreen";
import AdditionalInfoScreen from "../AdditionalInfoScreen/AdditionalInfoScreen";
import Icon from "react-native-vector-icons/FontAwesome"; // Importer FontAwesome

const Stack = createNativeStackNavigator();

const screenOptions = ({navigation}) => ({
  headerShown: true, // Affiche uniquement la flèche
  headerBackTitleVisible: false, // Cache le texte à côté de la flèche
  headerTitle: '', // Cache le titre
  headerTransparent: true, // Rend le header transparent
  headerStyle: {
    backgroundColor: 'transparent', // Assure que l'arrière-plan est transparent
    elevation: 0, // Enlève l'ombre sur Android
    shadowOpacity: 0, // Enlève l'ombre sur iOS
  },
  headerLeft: () => (
    <Icon
      name="arrow-left"
      size={24}
      color="#00FF00" // Couleur verte brillante
      onPress={() => navigation.goBack()}
      style={{marginLeft: 15}} // Ajouter de l'espace à gauche si nécessaire
    />
  ),
});

const ProfileEditNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="BasicInfo">
      <Stack.Screen
        name="BasicInfo"
        component={BasicInfoScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name="HealthInfo"
        component={HealthInfoScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name="LifestyleInfo"
        component={LifestyleInfoScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name="HabitsPreferences"
        component={HabitsPreferencesScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name="AdditionalInfo"
        component={AdditionalInfoScreen}
        options={screenOptions}
      />
    </Stack.Navigator>
  );
};

export default ProfileEditNavigator;
