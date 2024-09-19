import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './welcomStyles';
import { SafeAreaView } from 'react-native';

const Welcom = () => {
  const navigation = useNavigation();

  const handleContinue = () => {
    // Redirection directe vers AuthChoice
    navigation.navigate('AuthChoice');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcomeText}>
        Welcome to Calorie Tracker!
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Welcom;
