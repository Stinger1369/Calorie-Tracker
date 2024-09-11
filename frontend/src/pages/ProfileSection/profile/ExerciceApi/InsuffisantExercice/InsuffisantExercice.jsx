import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchExercisesByMuscleGroupAndTitle } from "../../../../../redux/features/exerciseApi/exerciseApiSlice";
import { useNavigation } from "@react-navigation/native";
import styles from "./InsuffisantExerciceStyle";
import { getExercisesForSession } from "./InsuffisantExerciceData";

// Get the screen width dynamically
const { width: screenWidth } = Dimensions.get('window');

const InsuffisantExercice = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loading, error, data: exercisesData } = useSelector((state) => state.exerciseApi);

  // État pour le mois et la séance
  const [currentMonth, setCurrentMonth] = useState(1); // Mois 1, Mois 2, Mois 3
  const [currentSession, setCurrentSession] = useState(1); // Séance 1, Séance 2, Séance 3
  const [exercises, setExercises] = useState([]); // Stocke les exercices récupérés

  useEffect(() => {
    const sessionExercises = getExercisesForSession(currentMonth, currentSession);
    const promises = sessionExercises.map((exercise) =>
      dispatch(fetchExercisesByMuscleGroupAndTitle(exercise))
        .unwrap()
        .then((response) => response[0]) // Only the first result for each exercise
    );

    // Resolve all promises and store the exercises
    Promise.all(promises)
      .then((resolvedExercises) => {
        setExercises(resolvedExercises.filter(ex => ex !== undefined));
      })
      .catch((err) => {
        console.error("Error fetching exercises:", err);
      });
  }, [currentMonth, currentSession, dispatch]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erreur : {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Display the current month and session */}
      <Text style={styles.monthText}>
        Mois {currentMonth} - Séance {currentSession}
      </Text>
      <View style={styles.switcherContainer}>
        <View style={styles.monthSwitcher}>
          <TouchableOpacity onPress={() => setCurrentMonth(1)}>
            <Text style={styles.monthButton}>Mois 1</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentMonth(2)}>
            <Text style={styles.monthButton}>Mois 2</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentMonth(3)}>
            <Text style={styles.monthButton}>Mois 3</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sessionSwitcher}>
          <TouchableOpacity onPress={() => setCurrentSession(1)}>
            <Text style={styles.sessionButton}>Séance 1</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentSession(2)}>
            <Text style={styles.sessionButton}>Séance 2</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentSession(3)}>
            <Text style={styles.sessionButton}>Séance 3</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Display the exercises */}
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }} // Ensure that the FlatList takes all available space
        data={exercises}
        keyExtractor={(item) => item && item._id ? item._id : Math.random().toString()} // Ensure a valid key
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.exerciseContainer}
            onPress={() => navigation.navigate("ExerciseDetails", { exercise: item })} // Navigate to details
          >
            {item && item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={[styles.exerciseImage, { width: screenWidth / 2.5, height: (screenWidth / 2.5) }]} // Dynamically sized image
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.placeholderImage, { width: screenWidth / 2.5, height: (screenWidth / 2.5) }]} />
            )}
            <Text style={styles.exerciseName}>{item?.title || "Exercice"}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default InsuffisantExercice;
