import React, {useState} from 'react';
import {View, Text, StyleSheet, Button, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {logout} from '../../redux/features/auth/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async saveData => {
    if (!saveData) {
      await AsyncStorage.removeItem('user'); // Supprimer les informations de l'utilisateur si l'utilisateur choisit de ne pas sauvegarder
    }
    dispatch(logout()); // Appeler l'action logout du redux
    navigation.navigate('Welcom'); // Rediriger vers l'écran Welcom
  };

  const confirmLogout = () => {
    Alert.alert(
      'Sauvegarder les données?',
      'Souhaitez-vous sauvegarder vos données pour une connexion rapide la prochaine fois?',
      [
        {
          text: 'Non',
          onPress: () => handleLogout(false),
          style: 'cancel',
        },
        {text: 'Oui', onPress: () => handleLogout(true)},
      ],
      {cancelable: false},
    );
  };

  if (!isLoggingOut) {
    confirmLogout();
    setIsLoggingOut(true);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Déconnexion en cours...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});

export default Logout;
