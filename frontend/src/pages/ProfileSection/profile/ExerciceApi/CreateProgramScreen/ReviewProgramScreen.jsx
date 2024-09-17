import React from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createCustomProgram } from "../../../../../redux/features/customProgramExerciceSlice/customProgramExerciceSlice";
import styles from "./ReviewProgramScreenStyle";

const ReviewProgramScreen = ({ navigation, route }) => {
  const { programName, durationMonths, sessionsPerWeek, exercises } = route.params;
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user); // Récupérer l'ID utilisateur

  const handleCreateProgram = () => {
    if (userInfo && userInfo._id) {
      const programData = {
        userId: userInfo._id,
        programName,
        durationMonths,
        sessionsPerWeek,
        exercises: exercises.map((exercise) => ({
          exerciseId: exercise._id,
          type: exercise.Type_Exercice,
          repetitions: exercise.repetitions,
          caloriesBurned: exercise.calories,
        })),
      };

      dispatch(createCustomProgram(programData))
        .then(() => {
          Alert.alert("Succès", "Votre programme a été créé avec succès !");
          navigation.navigate("ProfileTab"); // Retourner à l'écran de profil
        })
        .catch(() => {
          Alert.alert("Erreur", "Échec de la création du programme.");
        });
    } else {
      Alert.alert("Erreur", "Les informations de l'utilisateur sont manquantes.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Valider votre programme</Text>
      <FlatList
        data={exercises}
        renderItem={({ item }) => (
          <View style={styles.exerciseCard}>
            <Text>{item.title}</Text>
            <Text>{item.repetitions} répétitions</Text>
            <Text>{item.caloriesBurned} calories brûlées</Text>
          </View>
        )}
        keyExtractor={(item) => item._id}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateProgram}>
        <Text style={styles.buttonText}>Créer le programme</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReviewProgramScreen;
