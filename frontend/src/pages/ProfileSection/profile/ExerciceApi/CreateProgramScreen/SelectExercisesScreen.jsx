import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchExercisesByMuscleGroup, fetchMuscleGroups, toggleLikeOrUnlike } from "../../../../../redux/features/exerciseApi/exerciseApiSlice";
import ExerciceCustomCard from "./ExerciceCustomCard/ExerciceCustomCard";
import styles from "./SelectExercisesScreenStyle";

const SelectExercisesScreen = ({ navigation, route }) => {
  const { programName, durationMonths, sessionsPerWeek } = route.params;
  const dispatch = useDispatch();

  // Fetch data from the Redux store
  const { data: exercisesData, loading: exercisesLoading } = useSelector((state) => state.exerciseApi);
  const { muscleGroups, loading: muscleGroupsLoading } = useSelector((state) => state.exerciseApi);
  const user = useSelector((state) => state.auth.user); // Get user details from the auth state
  const userInfo = useSelector((state) => state.user.userInfo); // Get additional user info like gender from user slice

  const [userId, setUserId] = useState(user?._id || null); // Initialize with the userId from Redux if available
  const [exercises, setExercises] = useState([]); // Declare exercises and setExercises properly
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("Musculation"); // Default to Musculation

  // List of Musculation muscle groups
  const musculationMuscleGroups = [
    "épaules", "biceps", "triceps", "pectoraux", "dos", "abdominaux",
    "fessiers", "quadriceps", "ischio-jambiers", "mollets",
    "Exercices-avec-sangles-de-suspension", "unilatéraux",
    "polyarticulaires", "monoarticulaires"
  ];

  // Fetch userId from AsyncStorage if not available in Redux
  useEffect(() => {
    const fetchUserIdFromStorage = async () => {
      if (!userId) { // Check if userId is available in Redux
        try {
          const storedUserId = await AsyncStorage.getItem('userId');
          if (storedUserId) {
            setUserId(storedUserId); // Set userId from AsyncStorage
            console.log('Fetched userId from AsyncStorage:', storedUserId);
          } else {
            console.error('No userId found in AsyncStorage');
          }
        } catch (error) {
          console.error('Error fetching userId from AsyncStorage:', error);
        }
      }
    };

    fetchUserIdFromStorage();
  }, [userId]);

  // Fetch muscle groups and exercises on component mount
  useEffect(() => {
    dispatch(fetchMuscleGroups());
    dispatch(fetchExercisesByMuscleGroup("Musculation")); // Default to Musculation exercises
  }, [dispatch]);

  useEffect(() => {
    if (exercisesData) {
      setExercises(exercisesData); // Set exercises from Redux store
    }
  }, [exercisesData]);

  // Log user data for debugging
  useEffect(() => {
    console.log("Current userId:", userId);
    console.log("User Info:", userInfo);
  }, [userId, userInfo]);

  const handleMuscleGroupChange = (group) => {
    setSelectedMuscleGroup(group);
    dispatch(fetchExercisesByMuscleGroup(group));
  };

  const handleSelectExercise = (exercise) => {
    setSelectedExercises((prev) =>
      prev.includes(exercise)
        ? prev.filter((e) => e !== exercise)
        : [...prev, exercise]
    );
  };

  const handleSubmit = () => {
    if (selectedExercises.length === 0) {
      Alert.alert("Erreur", "Veuillez sélectionner au moins un exercice.");
      return;
    }
    navigation.navigate("ReviewProgramScreen", {
      programName,
      durationMonths,
      sessionsPerWeek,
      exercises: selectedExercises,
    });
  };

  // Function to handle likes
  const handleLike = (exerciseId) => {
    if (!userId || !userInfo?.gender) {
      console.error("Cannot like exercise without userId or gender");
      return; // Exit the function if userId or gender is missing
    }

    const dataToSend = { exerciseId, actionType: 'like', userId, gender: userInfo.gender };

    dispatch(toggleLikeOrUnlike(dataToSend))
      .unwrap()
      .then((response) => {
        // Update the specific exercise in the state
        setExercises((prevExercises) =>
          prevExercises.map((exercise) =>
            exercise._id === exerciseId ? { ...exercise, ...response.updatedExercise } : exercise
          )
        );
      })
      .catch((error) => {
        console.error("Like failed:", error);
      });
  };

  const handleUnlike = (exerciseId) => {
    if (!userId || !userInfo?.gender) {
      console.error("Cannot unlike exercise without userId or gender");
      return; // Exit the function if userId or gender is missing
    }

    const dataToSend = { exerciseId, actionType: 'unlike', userId, gender: userInfo.gender };

    dispatch(toggleLikeOrUnlike(dataToSend))
      .unwrap()
      .then((response) => {
        // Update the specific exercise in the state
        setExercises((prevExercises) =>
          prevExercises.map((exercise) =>
            exercise._id === exerciseId ? { ...exercise, ...response.updatedExercise } : exercise
          )
        );
      })
      .catch((error) => {
        console.error("Unlike failed:", error);
      });
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sélectionnez vos exercices</Text>

      {/* Muscle group filter */}
      <View style={styles.typeButtonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleMuscleGroupChange("Cardio")}>
          <Text style={styles.buttonText}>Cardio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleMuscleGroupChange("Musculation")}>
          <Text style={styles.buttonText}>Musculation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleMuscleGroupChange("Postures-de-yoga")}>
          <Text style={styles.buttonText}>Yoga</Text>
        </TouchableOpacity>
      </View>

      {/* Display muscle groups only if Musculation is selected */}
      {selectedMuscleGroup === "Musculation" && (
        <View style={styles.muscleGroupsContainer}>
          {muscleGroupsLoading ? (
            <Text>Chargement des groupes musculaires...</Text>
          ) : (
            <FlatList
              data={musculationMuscleGroups}
              horizontal
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.muscleGroupButton}
                  onPress={() => handleMuscleGroupChange(item)}
                >
                  <Text style={styles.muscleGroupButtonText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
          )}
        </View>
      )}

      {/* Display exercises */}
      {exercisesLoading ? (
        <Text>Chargement des exercices...</Text>
      ) : (
        <FlatList
          data={exercises}
          renderItem={({ item }) => (
            <ExerciceCustomCard
              exercise={item}
              onSelectExercise={() => handleSelectExercise(item)}
              isSelected={selectedExercises.includes(item)}
              onLike={() => handleLike(item._id)}
              onUnlike={() => handleUnlike(item._id)}
              liked={item.isLiked === true}
              unliked={item.isLiked === false}
            />
          )}
          keyExtractor={(item) => item._id}
          extraData={exercises}
        />
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Valider le programme</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectExercisesScreen;
