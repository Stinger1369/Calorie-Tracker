// src/navigation/MonthTabNavigator.js
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import InsuffisantExercice from '../pages/ProfileSection/profile/ExerciceApi/InsuffisantExercice/InsuffisantExercice';
import NormalExercice from '../pages/ProfileSection/profile/ExerciceApi/NormalExercice';
import SurpoidsExercice from '../pages/ProfileSection/profile/ExerciceApi/SurpoidsExercice';

const Tab = createMaterialTopTabNavigator();

const MonthTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Mois 1" component={InsuffisantExercice} />
      <Tab.Screen name="Mois 2" component={NormalExercice} />
      <Tab.Screen name="Mois 3" component={SurpoidsExercice} />
    </Tab.Navigator>
  );
};

export default MonthTabNavigator;
