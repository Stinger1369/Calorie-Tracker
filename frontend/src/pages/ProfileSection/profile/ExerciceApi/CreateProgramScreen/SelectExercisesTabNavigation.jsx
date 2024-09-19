import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CardioScreen from './SelectExercisesScreen/CardioScreen/CardioScreen';
import MusculationScreen from './SelectExercisesScreen/MusculationScreen/MusculationScreen';
import YogaScreen from './SelectExercisesScreen/YogaScreen';

const Tab = createMaterialTopTabNavigator();

const SelectExercisesTabNavigation = ({ route }) => {
  // Récupérer les paramètres passés depuis CreateProgramScreen
  const { programName, durationMonths, sessionsPerWeek, currentSession, totalSessions, sessions } = route.params;

  return (
    <Tab.Navigator
      initialRouteName="Cardio" // Onglet Musculation affiché par défaut
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50', // Couleur de l'onglet actif
        tabBarInactiveTintColor: '#888', // Couleur de l'onglet inactif
        tabBarIndicatorStyle: { backgroundColor: '#4CAF50' }, // Style de l'indicateur
        tabBarStyle: { backgroundColor: '#FFF' }, // Style de la barre d'onglets
      }}
    >
      <Tab.Screen
        name="Cardio"
        component={CardioScreen}
        options={{ tabBarLabel: 'Cardio' }}
        initialParams={{ programName, durationMonths, sessionsPerWeek, currentSession, totalSessions, sessions }}
      />
      <Tab.Screen
        name="Musculation"
        component={MusculationScreen}
        options={{ tabBarLabel: 'Musculation' }}
        initialParams={{ programName, durationMonths, sessionsPerWeek, currentSession, totalSessions, sessions }}
      />
      <Tab.Screen
        name="Yoga"
        component={YogaScreen}
        options={{ tabBarLabel: 'Yoga' }}
        initialParams={{ programName, durationMonths, sessionsPerWeek, currentSession, totalSessions, sessions }}
      />
    </Tab.Navigator>
  );
};

export default SelectExercisesTabNavigation;
