// src/navigation/ScanTabNavigator.js
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ScanCode from '../pages/ScanCode/ScanCode';
import ScanHistory from '../pages/ScanCode/ScanHistory';

const Tab = createMaterialTopTabNavigator();

const ScanTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Scanner" component={ScanCode} />
      <Tab.Screen name="Historique" component={ScanHistory} />
    </Tab.Navigator>
  );
};

export default ScanTabNavigator;
