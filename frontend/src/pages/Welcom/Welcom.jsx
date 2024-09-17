import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserId, fetchUserInfo } from '../../redux/features/user/userSlice';
import { restoreToken } from '../../redux/features/auth/authSlice'; // Import de restoreToken
import styles from './welcomStyles';
import { SafeAreaView } from 'react-native';

const Welcom = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [localUserId, setLocalUserId] = useState(null); // Ajout de localUserId pour stocker l'ID localement
  const { token } = useSelector((state) => state.auth); // Sélection du token depuis Redux

  // Premier useEffect pour vérifier le statut de l'utilisateur et restaurer les données
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');

        if (user && storedToken) {
          const parsedUser = JSON.parse(user);
          if (parsedUser && parsedUser.firstName) {
            setUserName(parsedUser.firstName);

            // Restaurez le token et l'utilisateur dans Redux
            dispatch(restoreToken({ user: parsedUser, token: storedToken }));

            // Chargez l'ID utilisateur
            const result = await dispatch(fetchUserId()).unwrap();

            if (!result) {
              // Si aucune information d'utilisateur n'est récupérée de la base de données, supprimer l'utilisateur localement
              await AsyncStorage.removeItem('user');
              setUserName(null);
              setLoading(false);
            } else {
              // Stocke l'userId localement
              setLocalUserId(result);
              setLoading(false);
            }
          } else {
            setLoading(false); // Si aucune information utilisateur n'est trouvée localement
          }
        } else {
          setLoading(false); // Si aucun utilisateur ou token n'est trouvé
        }
      } catch (e) {
        console.log('Failed to load user status:', e);
        setLoading(false); // Arrêtez le chargement en cas d'erreur
      }
    };

    checkUserStatus();
  }, [dispatch]);

  // Deuxième useEffect pour récupérer les informations utilisateur après la restauration du token et de l'ID utilisateur
  useEffect(() => {
    const fetchData = async () => {
      if (localUserId && token) {
        console.log("Fetching user info for userId:", localUserId);
        await dispatch(fetchUserInfo({ userId: localUserId, source: "welcom" }))
          .unwrap()
          .catch((err) => {
            console.error("Failed to fetch user info:", err);
          });
      } else {
        console.log("User ID ou token manquant après restauration. Impossible de récupérer les informations utilisateur.");
      }
    };

    fetchData();
  }, [localUserId, token, dispatch]);

  const handleContinue = () => {
    if (userName) {
      navigation.navigate('Home');
    } else {
      navigation.navigate('AuthChoice');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcomeText}>
        {userName
          ? `Welcome back, ${userName}!`
          : 'Welcome to Calorie Tracker!'}
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Welcom;
