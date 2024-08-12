import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './authChoiceStyles'; // Import external styles

const AuthChoice = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await AsyncStorage.getItem('user');
        if (data) {
          setUserData(JSON.parse(data));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    getUserData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.overlay} />
      <Text style={styles.title}>Calorie Tracker</Text>
      {userData && (
        <Text style={styles.userData}>
          Welcome Back {userData.firstName} {userData.lastName}
        </Text>
      )}
      <Text style={styles.subtitle}>
        Please log in or register to continue your journey to a healthier life.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthChoice;
