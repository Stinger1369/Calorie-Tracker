import React, {useState} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import Home from '../pages/Home/Home';
import Contact from '../pages/Contact/Contact';
import Profile from '../pages/Profile/Profile';
import CustomDrawer from './CustomDrawer';
import styles from './TabNavigatorStyle';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigation = useNavigation();

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('HomeTab')}>
          <Text style={styles.iconText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Contact')}>
          <Text style={styles.iconText}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('ProfileTab')}>
          <Text style={styles.iconText}>Profile</Text>
        </TouchableOpacity>
      </View>
      <Tab.Navigator screenOptions={{tabBarStyle: {display: 'none'}}}>
        <Tab.Screen
          name="HomeTab"
          component={Home}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="Contact"
          component={Contact}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="ProfileTab"
          component={Profile} // Ajout de l'écran Profile au TabNavigator
          options={{headerShown: false}}
        />
      </Tab.Navigator>
      <View style={styles.triangleContainer}>
        <TouchableOpacity style={styles.triangle} onPress={toggleDrawer} />
      </View>
      <CustomDrawer isVisible={drawerVisible} onClose={toggleDrawer} />
    </>
  );
};

export default TabNavigator;
