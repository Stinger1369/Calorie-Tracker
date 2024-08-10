import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
          console.log('User data found, attempting to parse...');
          const parsedUser = JSON.parse(user);
          console.log('Parsed user data:', parsedUser);

          if (parsedUser && parsedUser.firstName) {
            console.log('User first name found:', parsedUser.firstName);
            setUserName(parsedUser.firstName); // Update state with user's first name
          } else {
            console.error('Parsed user data is invalid:', parsedUser);
          }
        } else {
          console.log('No user data found');
        }
      } catch (e) {
        console.error('Failed to load user status:', e);
      }
    };

    checkUserStatus();
  }, []);

  const handleContinue = () => {
    if (userName) {
      console.log('Navigating to Home');
      navigation.navigate('Home'); // Redirect to Home if user is found
    } else {
      console.log('Navigating to AuthChoice');
      navigation.navigate('AuthChoice'); // Redirect to AuthChoice if no user data
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        {userName
          ? `Welcome back, ${userName}!` // Display user's first name if found
          : 'Welcome to Calorie Tracker!'}
      </Text>
      <ActivityIndicator size="large" color="#0000ff" />
      <Button title="Continue" onPress={handleContinue} />
      {/* The button will navigate to the appropriate screen */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Welcom;
