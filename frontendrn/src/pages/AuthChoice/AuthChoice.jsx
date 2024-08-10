import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthChoice = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await AsyncStorage.getItem('user');
        console.log('User data from AsyncStorage:', data);
        if (data) {
          setUserData(JSON.parse(data));
        } else {
          console.log('No user data found');
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    getUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Calorie Tracker</Text>
      {userData && (
        <Text style={styles.userData}>
          Welcom Back {userData.firstName} {userData.lastName}
        </Text>
      )}
      <Text style={styles.subtitle}>
        Veuillez vous connecter ou vous inscrire pour continuer.
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={() => navigation.navigate('Login')} />
        <Button
          title="Register"
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userData: {
    fontSize: 18,
    marginBottom: 20,
    color: 'green',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default AuthChoice;
