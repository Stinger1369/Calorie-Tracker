import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createCustomProgram } from "../../../../../redux/features/customProgramExerciceSlice/customProgramExerciceSlice";
import styles from "./ReviewProgramScreenStyle";

const ReviewProgramScreen = ({ navigation, route }) => {
  const { programName, durationMonths, sessionsPerWeek, sessions } = route.params;
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

  const [monthIndex, setMonthIndex] = useState(0); // Mois sélectionné
  const [sessionIndex, setSessionIndex] = useState(0); // Session sélectionnée

  useEffect(() => {
    console.log("Program Name:", programName);
    console.log("Duration Months:", durationMonths);
    console.log("Sessions Per Week:", sessionsPerWeek);
    console.log("Sessions:", sessions);
  }, [programName, durationMonths, sessionsPerWeek, sessions]);

  const handleCreateProgram = () => {
    if (userInfo && userInfo._id) {
      const programData = {
        userId: userInfo._id,
        programName,
        durationMonths,
        sessionsPerWeek,
        sessions: sessions.map((session, index) => ({
          sessionNumber: index + 1,
          exercises: session.exercises.map((exercise) => ({
            exerciseId: exercise._id,
            type: exercise.type,
            repetitions: exercise.repetitions,
            caloriesBurned: exercise.calories,
          })),
        })),
      };

      console.log("Program Data Sent to Backend:", programData);
      dispatch(createCustomProgram(programData))
        .then(() => {
          Alert.alert("Succès", "Votre programme a été créé avec succès !");
          navigation.navigate("ProfileTab");
        })
        .catch(() => {
          Alert.alert("Erreur", "Échec de la création du programme.");
        });
    } else {
      Alert.alert("Erreur", "Les informations de l'utilisateur sont manquantes.");
    }
  };

  const renderExercise = ({ item }) => (
    <View style={styles.exerciseCard}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.exerciseImage} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Pas d'image</Text>
        </View>
      )}
      <View style={styles.exerciseDetails}>
        <Text style={styles.exerciseTitle}>{item.title}</Text>
        <Text style={styles.exerciseInfo}>{item.repetitions} répétitions</Text>
        <Text style={styles.exerciseInfo}>{item.calories} calories brûlées</Text>
      </View>
    </View>
  );

  const renderSessionContent = () => {
    const session = sessions[(monthIndex * sessionsPerWeek) + sessionIndex];

    return (
      <View style={styles.containerSession}>
        <FlatList
          data={session.exercises}
          renderItem={renderExercise}
          keyExtractor={(item) => item._id}
        />
      </View>
    );
  };

return (
  <View style={styles.container}>
    {/* Sélection du Mois */}
    <View style={styles.containerMonth}>
      {Array.from({ length: durationMonths }).map((_, i) => (
        <TouchableOpacity
          key={`month-${i}`}
          onPress={() => setMonthIndex(i)}
          style={{
            backgroundColor: monthIndex === i ? '#4CAF50' : '#D3D3D3',
            padding: 10,
            alignItems: 'center',
            flex: 1, // Les boutons prendront une largeur égale
          }}
        >
          <Text style={{ color: monthIndex === i ? '#FFF' : '#000' }}>
            Mois {i + 1}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    {/* Sélection de la Séance */}
    <View style={styles.containerSession}>
      {Array.from({ length: sessionsPerWeek }).map((_, i) => (
        <TouchableOpacity
          key={`session-${i}`}
          onPress={() => setSessionIndex(i)}
          style={{
            backgroundColor: sessionIndex === i ? '#4CAF50' : '#D3D3D3',
            padding: 10,
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Text style={{ color: sessionIndex === i ? '#FFF' : '#000' }}>
            Séance {i + 1}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    {/* Affichage des exercices */}
    {renderSessionContent()}

    <TouchableOpacity style={styles.button} onPress={handleCreateProgram}>
      <Text style={styles.buttonText}>Créer le programme</Text>
    </TouchableOpacity>
  </View>
);



};

export default ReviewProgramScreen;
