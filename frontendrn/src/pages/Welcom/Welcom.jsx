import React, {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './welcomStyles';

const Welcom = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const user = await AsyncStorage.getItem('user');

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
      navigation.navigate('Home'); // L'utilisateur a sauvegardé ses informations, on va directement à Home
    } else {
      navigation.navigate('AuthChoice'); // L'utilisateur doit se reconnecter
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
