import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Session from "./SessionInsuffisantExercice";

const Tab = createMaterialTopTabNavigator();

const InsuffisantExercice = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        lazy: true, // Garde l'option lazy dans screenOptions
      }}
    >
      <Tab.Screen name="Mois 1">
        {() => <Session month={1} />}
      </Tab.Screen>
      <Tab.Screen name="Mois 2">
        {() => <Session month={2} />}
      </Tab.Screen>
      <Tab.Screen name="Mois 3">
        {() => <Session month={3} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default InsuffisantExercice;
