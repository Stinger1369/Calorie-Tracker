import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExercisesByMuscleGroup,
  fetchMuscleGroups,
  fetchExercisesWithLikeStatus,
} from "../../../../../redux/features/exerciseApi/exerciseApiSlice";
import { fetchUserInfoWithFields } from "../../../../../redux/features/user/userSlice"; // Import the action for fetching user info

import ExerciceCustomCard from "./ExerciceCustomCard/ExerciceCustomCard";
import { handleLikeExercise, handleUnlikeExercise } from "../../../../../utils/likeUtil";
import styles from "./SelectExercisesScreenStyle";

const SelectExercisesScreen = ({ navigation, route }) => {
  const { programName, durationMonths, sessionsPerWeek, currentSession, totalSessions, sessions } = route.params;
  const dispatch = useDispatch();

  // Fetch data from the Redux store
  const { data: exercisesData, loading: exercisesLoading } = useSelector(
    (state) => state.exerciseApi
  );
  const { muscleGroups, loading: muscleGroupsLoading } = useSelector(
    (state) => state.exerciseApi
  );
  const user = useSelector((state) => state.auth.user);
  const userInfo = useSelector((state) => state.user.userInfo);

  const [userId, setUserId] = useState(user?._id || null);
  const [gender, setGender] = useState(null);  // State to store user gender
  const [exercises, setExercises] = useState([]);
  const [cachedExercises, setCachedExercises] = useState({});  // To cache exercises per muscle group
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("Musculation");
  const [loadingExercises, setLoadingExercises] = useState(false);
  const musculationMuscleGroups = [
    "épaules", "biceps", "triceps", "pectoraux", "dos", "abdominaux",
    "fessiers", "quadriceps", "ischio-jambiers", "mollets",
    "Exercices-avec-sangles-de-suspension", "unilatéraux",
    "polyarticulaires", "monoarticulaires",
  ];

  // Fetch user ID from storage
  useEffect(() => {
    const fetchUserIdFromStorage = async () => {
      if (!userId) {
        try {
          const storedUserId = await AsyncStorage.getItem("userId");
          if (storedUserId) {
            setUserId(storedUserId);
          } else {
            console.error("No userId found in AsyncStorage");
          }
        } catch (error) {
          console.error("Error fetching userId from AsyncStorage:", error);
        }
      }
    };
    fetchUserIdFromStorage();
  }, [userId]);

  // Fetch muscle groups and initial exercises for "Musculation"
  useEffect(() => {
    dispatch(fetchMuscleGroups());
    if (!cachedExercises["Musculation"]) {
      dispatch(fetchExercisesByMuscleGroup("Musculation"));
    }
  }, [dispatch]);

  // Fetch user info (specifically gender)
  useEffect(() => {
    if (userId && !gender) {
      dispatch(
        fetchUserInfoWithFields({
          userId,
          fields: ["gender"],  // Specify to only fetch gender
        })
      ).then((res) => {
        if (res.payload?.gender) {
          setGender(res.payload.gender);
        }
      });
    }
  }, [userId, gender, dispatch]);

  // Update exercises when data from redux store changes
  useEffect(() => {
    if (exercisesData && userId && gender) {
      const fetchStatuses = exercisesData.map((exercise) => {
        return dispatch(fetchExercisesWithLikeStatus({
          exerciseId: exercise._id,
          userId,
          gender,
        })).then((res) => {
          const { isLiked, isUnliked } = res.payload;
          return {
            ...exercise,
            isLiked,
            isUnliked,
          };
        });
      });

      Promise.all(fetchStatuses).then((updatedExercises) => {
        setExercises(updatedExercises);
        setCachedExercises(prevCache => ({
          ...prevCache,
          [selectedMuscleGroup]: updatedExercises,  // Cache exercises per muscle group
        }));
      }).catch((error) => {
        console.error("Error fetching like/unlike statuses:", error);
      });
    }
  }, [exercisesData, userId, gender, dispatch]);

  // Handle muscle group change, fetch from cache if exists

const handleMuscleGroupChange = (group) => {
  setSelectedMuscleGroup(group);
  setLoadingExercises(true); // Active le chargement
  if (cachedExercises[group]) {
    setExercises(cachedExercises[group]);
    setLoadingExercises(false); // Désactive le chargement si en cache
  } else {
    dispatch(fetchExercisesByMuscleGroup(group)).then(() => {
      setLoadingExercises(false); // Désactive le chargement une fois les exercices récupérés
    });
  }
};


  const handleSelectExercise = (exercise) => {
    setSelectedExercises((prev) =>
      prev.includes(exercise)
        ? prev.filter((e) => e !== exercise)
        : [...prev, exercise]
    );
  };

 const handleNextSession = () => {
  if (selectedExercises.length === 0) {
    Alert.alert("Erreur", "Veuillez sélectionner au moins un exercice.");
    return;
  }

  const updatedSessions = [...sessions, { sessionNumber: currentSession, exercises: selectedExercises }];

  if (currentSession === totalSessions) {
    // Toutes les séances sont configurées, passer à l'écran de révision
    navigation.navigate("ReviewProgramScreen", {
      programName,
      durationMonths,
      sessionsPerWeek,
      sessions: updatedSessions, // Passer toutes les séances créées
    });
  } else {
    // Réinitialiser les exercices sélectionnés avant de passer à la séance suivante
    setSelectedExercises([]);  // Efface la sélection des exercices

    // Passer à la séance suivante
    navigation.navigate("SelectExercisesScreen", {
      programName,
      durationMonths,
      sessionsPerWeek,
      currentSession: currentSession + 1,
      totalSessions,
      sessions: updatedSessions,  // Conserver les séances déjà créées
    });
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sélectionnez vos exercices pour la séance {currentSession}</Text>

      <View style={styles.typeButtonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleMuscleGroupChange("Cardio")}
        >
          <Text style={styles.buttonText}>Cardio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleMuscleGroupChange("Musculation")}
        >
          <Text style={styles.buttonText}>Musculation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleMuscleGroupChange("Postures-de-yoga")}
        >
          <Text style={styles.buttonText}>Yoga</Text>
        </TouchableOpacity>
      </View>

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
       onPressDetails={() => navigation.navigate('ExerciseDetailsScreenFull', { exercise: item })}
      onLike={() => handleLikeExercise(item._id, userId, gender, dispatch, setExercises)}
      onUnlike={() => handleUnlikeExercise(item._id, userId, gender, dispatch, setExercises)}
      liked={item.isLiked === true}
      unliked={item.isUnliked === true}
    />
  )}
  keyExtractor={(item) => item._id}  // Utilisation d'une clé unique
  extraData={selectedExercises}
/>

      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleNextSession}>
        <Text style={styles.submitButtonText}>
          {currentSession === totalSessions ? "Terminer" : "Séance suivante"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectExercisesScreen;
