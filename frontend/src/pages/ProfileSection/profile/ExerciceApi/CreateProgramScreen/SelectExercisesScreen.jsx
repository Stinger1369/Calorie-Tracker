import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExercisesByMuscleGroup,
  fetchMuscleGroups,
  toggleLikeOrUnlike,
  fetchExercisesWithLikeStatus,
} from "../../../../../redux/features/exerciseApi/exerciseApiSlice";
import { fetchUserInfoWithFields } from "../../../../../redux/features/user/userSlice"; // Import the action for fetching user info

import ExerciceCustomCard from "./ExerciceCustomCard/ExerciceCustomCard";
import styles from "./SelectExercisesScreenStyle";

const SelectExercisesScreen = ({ navigation, route }) => {
  const { programName, durationMonths, sessionsPerWeek } = route.params;
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
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("Musculation");

  const musculationMuscleGroups = [
    "épaules", "biceps", "triceps", "pectoraux", "dos", "abdominaux",
    "fessiers", "quadriceps", "ischio-jambiers", "mollets",
    "Exercices-avec-sangles-de-suspension", "unilatéraux",
    "polyarticulaires", "monoarticulaires",
  ];

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

  useEffect(() => {
    dispatch(fetchMuscleGroups());
    dispatch(fetchExercisesByMuscleGroup("Musculation"));
  }, [dispatch]);
// Fetch user info (specifically gender) on component mount
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
useEffect(() => {
    if (exercisesData && userId && gender) {
      setExercises(exercisesData);
      exercisesData.forEach((exercise) => {
        dispatch(
          fetchExercisesWithLikeStatus({
            exerciseId: exercise._id,
            userId,
            gender,
          })
        ).then((res) => {
          const { isLiked, isUnliked } = res.payload;
        console.log(`Result for exercise ${exercise.title} (ID: ${exercise._id}): Liked = ${isLiked}, Unliked = ${isUnliked}`);

        setExercises((prevExercises) =>
            prevExercises.map((ex) =>
              ex._id === exercise._id ? { ...ex, isLiked, isUnliked } : ex
            )
          );
        });
      });
    }
  }, [exercisesData, userId, gender, dispatch]);







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

// Handle liking an exercise
  const handleLike = (exerciseId) => {
    if (!userId || !gender) {
      console.error("Cannot like exercise without userId or gender");
      return;
    }

    const dataToSend = {
      exerciseId,
      actionType: "like",
      userId,
      gender,
    };

    dispatch(toggleLikeOrUnlike(dataToSend))
      .unwrap()
      .then((response) => {
        setExercises((prevExercises) =>
          prevExercises.map((exercise) =>
            exercise._id === exerciseId
              ? { ...exercise, isLiked: true, isUnliked: false }  // Update like/unlike status
              : exercise
          )
        );
      })
      .catch((error) => {
        console.error("Like failed:", error);
      });
  };

  // Handle unliking an exercise
  const handleUnlike = (exerciseId) => {
    if (!userId || !gender) {
      console.error("Cannot unlike exercise without userId or gender");
      return;
    }

    const dataToSend = {
      exerciseId,
      actionType: "unlike",
      userId,
      gender,
    };

    dispatch(toggleLikeOrUnlike(dataToSend))
      .unwrap()
      .then((response) => {
        setExercises((prevExercises) =>
          prevExercises.map((exercise) =>
            exercise._id === exerciseId
              ? { ...exercise, isLiked: false, isUnliked: true }  // Update like/unlike status
              : exercise
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
  onLike={() => handleLike(item._id)}
  onUnlike={() => handleUnlike(item._id)}
  liked={item.isLiked === true}
  unliked={item.isUnliked === true}
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
