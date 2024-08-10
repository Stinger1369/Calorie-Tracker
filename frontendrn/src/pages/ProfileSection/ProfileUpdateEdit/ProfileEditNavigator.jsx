import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BasicInfoScreen from './BasicInfoScreen';
import HealthInfoScreen from './HealthInfoScreen';
import LifestyleInfoScreen from './LifestyleInfoScreen';
import HabitsPreferencesScreen from './HabitsPreferencesScreen';
import AdditionalInfoScreen from './AdditionalInfoScreen';


const Stack = createNativeStackNavigator();

const ProfileEditNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="BasicInfo">
      <Stack.Screen
        name="BasicInfo"
        component={BasicInfoScreen}
        options={{title: 'Basic Information'}}
      />
      <Stack.Screen
        name="HealthInfo"
        component={HealthInfoScreen}
        options={{title: 'Health Information'}}
      />
      <Stack.Screen
        name="LifestyleInfo"
        component={LifestyleInfoScreen}
        options={{title: 'Lifestyle Information'}}
      />
      <Stack.Screen
        name="HabitsPreferences"
        component={HabitsPreferencesScreen}
        options={{title: 'Habits & Preferences'}}
      />
      <Stack.Screen
        name="AdditionalInfo"
        component={AdditionalInfoScreen}
        options={{title: 'Additional Information'}}
      />
    </Stack.Navigator>
  );
};

export default ProfileEditNavigator;
