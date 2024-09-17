import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Image, Modal, TouchableOpacity, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "../../../../../../../redux/features/user/userSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './ExerciseDetailsScreenStyle';

const PlaceholderImage = 'https://via.placeholder.com/150';

// Get the screen width dynamically
const { width: screenWidth } = Dimensions.get('window');

const getBmiCategory = (bmi) => {
  if (bmi < 18.5) return 'Insuffisant';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Surpoids';
  return 'Obese';
};

const ExerciseDetailsScreen = ({ route }) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const { userInfo, loading: userLoading, error: userError } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let userId;
        if (token) {
          const storedUser = await AsyncStorage.getItem("user");
          userId = storedUser ? JSON.parse(storedUser).id : null;
        }
        if (userId) {
         dispatch(fetchUserInfo({ userId, source: "ExerciseDetailsScreen" })); // Replace "ComponentName" with the actual name of the component

        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [dispatch, token]);

  const { exercise } = route.params || {};
  const { gender, bmi } = userInfo || {};

  const {
    title = "Exercice sans titre",
    imageUrl,
    description = "Pas de description disponible.",
    instructions = "Aucune instruction fournie.",
    trainingTips = "Aucun conseil fourni.",
    Insuffisant_Reps = {},
    Normal_Reps = {},
    Surpoids_Reps = {},
    Obese_Reps = {},
  } = exercise || {};

  const exerciseInfo = useMemo(() => {
    if (!bmi || !gender) return null;

    const bmiCategory = getBmiCategory(bmi);
    const repsInfo = exercise[`${bmiCategory}_Reps`];

    if (!repsInfo) return null;

    return {
      bmiCategory,
      repetitions: repsInfo.repetitions,
      caloriesBurned: repsInfo.calories_depensée[gender] || repsInfo.calories_depensée.other,
      caloriesPerRep: repsInfo.calories_depense_repetition[gender] || repsInfo.calories_depense_repetition.other
    };
  }, [exercise, bmi, gender]);

  const renderExerciseInfo = () => {
    if (!exerciseInfo) {
      return (
        <Text style={styles.warningText}>
          Complétez votre profil pour voir les informations spécifiques.
        </Text>
      );
    }

    return (
      <View style={styles.repsContainer}>
        <Text style={styles.repsTitle}>Informations personnalisées :</Text>
        <Text style={styles.repsText}>Catégorie IMC : {exerciseInfo.bmiCategory}</Text>
        <Text style={styles.repsText}>Répétitions recommandées : {exerciseInfo.repetitions}</Text>
        <Text style={styles.repsText}>Calories dépensées : {exerciseInfo.caloriesBurned}</Text>
        <Text style={styles.repsText}>Calories par répétition : {exerciseInfo.caloriesPerRep}</Text>
      </View>
    );
  };

  const renderList = (text) => {
    return text.split('|').map((item, index) => (
      <Text key={index} style={styles.listItem}>• {item.trim()}</Text>
    ));
  };

  if (userLoading) {
    return <Text>Chargement des informations utilisateur...</Text>;
  }

  if (userError) {
    return <Text>Erreur de chargement: {userError}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {/* Touchable image to open modal */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
          source={{ uri: imageUrl ? `${imageUrl}?ts=${Date.now()}` : PlaceholderImage }}
          style={[styles.image, { width: screenWidth - 40, height: (screenWidth - 40) * 0.75 }]} // Adjust the image size dynamically
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.modalCloseText}>Fermer</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: imageUrl ? `${imageUrl}?ts=${Date.now()}` : PlaceholderImage }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </View>
      </Modal>

      <Text style={styles.description}>{description}</Text>

      <Text style={styles.instructionsTitle}>Instructions:</Text>
      {renderList(instructions)}

      <Text style={styles.tipsTitle}>Conseils d'entraînement:</Text>
      {renderList(trainingTips)}

      {renderExerciseInfo()}
    </ScrollView>
  );
};

export default ExerciseDetailsScreen;
