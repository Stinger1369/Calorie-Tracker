import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../redux/features/auth/authSlice';
console.log("Action logout importée:", logout);

const Logout = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fonction pour gérer la déconnexion
const handleLogout = async () => {
  console.log("Déconnexion en cours, suppression des données...");

  try {
    // Supprimez les données du `token` après toutes les autres actions
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');

    // Mettez à jour le state Redux après la suppression du token
    dispatch(logout());

    // Rediriger l'utilisateur
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
  }
};


useEffect(() => {
  console.log("État actuel de Redux après déconnexion:", { userInfo: userInfo, token: token });
}, [userInfo, token]);



  // Fonction pour confirmer la déconnexion
  const confirmLogout = () => {
    console.log("Affichage de la confirmation de déconnexion...");
    Alert.alert(
      'Sauvegarder les données?',
      'Souhaitez-vous sauvegarder vos données pour une connexion rapide la prochaine fois?',
      [
        {
          text: 'Non',
          onPress: () => {
            console.log("Choix: Ne pas sauvegarder");
            handleLogout(false);
          }, // Ne pas sauvegarder
          style: 'cancel',
        },
        {
          text: 'Oui',
          onPress: () => {
            console.log("Choix: Sauvegarder");
            handleLogout(true);
          }, // Sauvegarder
        },
      ],
      { cancelable: false },
    );
  };

  // Utiliser useEffect pour afficher la confirmation de déconnexion seulement une fois
  useEffect(() => {
    if (!isLoggingOut) {
      console.log("Initialisation de la déconnexion...");
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
