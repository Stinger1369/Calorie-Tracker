import React, {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './welcomStyles'; // Import the externalized styles

const Welcom = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        console.log('Attempting to retrieve user data from AsyncStorage...');
        const user = await AsyncStorage.getItem('user');
        console.log('User data retrieved from AsyncStorage:', user);

        if (user) {
          const parsedUser = JSON.parse(user);
          if (parsedUser && parsedUser.firstName) {
            setUserName(parsedUser.firstName);
          }
        }
      } catch (e) {
        console.error('Failed to load user status:', e);
      }
    };

    checkUserStatus();
  }, []);

  const handleContinue = () => {
    if (userName) {
      navigation.navigate('Home');
    } else {
      navigation.navigate('AuthChoice');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        {userName
          ? `Welcome back, ${userName}!`
          : 'Welcome to Calorie Tracker!'}
      </Text>
      <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Welcom;
