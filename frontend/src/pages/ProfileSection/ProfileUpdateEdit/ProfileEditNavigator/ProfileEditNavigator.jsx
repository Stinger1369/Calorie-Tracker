import React from "react";
import {
  View,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BasicInfoScreen from "../BasicInfoScreen/BasicInfoScreen";
import HealthInfoScreen from "../HealthInfoScreen/HealthInfoScreen";
import LifestyleInfoScreen from "../LifestyleInfoScreen/LifestyleInfoScreen";
import HabitsPreferencesScreen from "../HabitsPreferencesScreen/HabitsPreferencesScreen";
import AdditionalInfoScreen from "../AdditionalInfoScreen/AdditionalInfoScreen";
import ExerciseScreen from "../ExerciseScreen/ExerciseScreen";
import Icon from "react-native-vector-icons/FontAwesome"; // Importer FontAwesome

const Stack = createNativeStackNavigator();

const screenOptions = ({ navigation }) => ({
  headerShown: true,
  headerBackTitleVisible: false,
  headerTitle: "",
  headerTransparent: true,
  headerStyle: {
    backgroundColor: "transparent",
    elevation: 0,
    shadowOpacity: 0,
  },
  headerLeft: () => (
    <Icon
      name="arrow-left"
      size={24}
      color="#00FF00"
      onPress={() => navigation.goBack()}
      style={{ marginLeft: 15 }}
    />
  ),
  headerBackground: () => (
    <View style={{ height: "100%", backgroundColor: "rgba(0, 0, 0, 0.0)" }} />
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
        name="Exercise"
        component={ExerciseScreen}
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
