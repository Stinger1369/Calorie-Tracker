import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../redux/features/auth/authSlice';

const Logout = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    console.log("Déconnexion en cours, suppression des données...");

    try {
      // Supprimer toutes les données de AsyncStorage
      await AsyncStorage.clear();

      // Mettre à jour le state Redux après la suppression des données
      dispatch(logout());

      // Rediriger l'utilisateur vers l'écran de bienvenue
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  // Fonction pour confirmer la déconnexion
  const confirmLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ? Toutes les données seront supprimées.',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Oui',
          onPress: handleLogout, // Déconnexion et suppression des données
        },
      ],
      { cancelable: false }
    );
  };

  // Utiliser useEffect pour afficher la confirmation de déconnexion seulement une fois
  useEffect(() => {
    if (!isLoggingOut) {
      confirmLogout();
      setIsLoggingOut(true);
    }
  }, [isLoggingOut]);

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
