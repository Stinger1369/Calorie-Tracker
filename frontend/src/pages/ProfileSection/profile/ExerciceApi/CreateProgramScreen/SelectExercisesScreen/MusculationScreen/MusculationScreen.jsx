import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fetchExercisesByMuscleGroup,
  fetchExercisesWithLikeStatus,
} from "../../../../../../../redux/features/exerciseApi/exerciseApiSlice";
import { fetchUserInfoWithFields } from "../../../../../../../redux/features/user/userSlice";
import ExerciceCustomCard from "../../ExerciceCustomCard/ExerciceCustomCard";
import { handleLikeExercise, handleUnlikeExercise } from "../../../../../../../utils/likeUtil";
import styles from "./MusculationScreenStyle";  // Importation des styles

const MusculationScreen = ({ navigation, route }) => {
  const {
    programName = "", // Utilisation de valeurs par défaut pour éviter l'erreur
    durationMonths = 0,
    sessionsPerWeek = 0,
    currentSession = 1,
    totalSessions = 0,
    sessions = []
  } = route?.params || {};  // Si route.params est undefined, on utilise un objet vide

  if (!programName) {
    console.error("Les paramètres de programme sont manquants !");
    return <Text>Erreur: Paramètres manquants</Text>;
  }

  const dispatch = useDispatch();

  const { data: exercisesData, loading: exercisesLoading } = useSelector(
    (state) => state.exerciseApi
  );
  const user = useSelector((state) => state.auth.user);

  const [userId, setUserId] = useState(user?._id || null);
  const [gender, setGender] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [cachedExercises, setCachedExercises] = useState({});
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("pectoraux");

  const musculationMuscleGroups = [
    "épaules", "biceps", "triceps", "pectoraux", "dos", "abdominaux",
    "fessiers", "quadriceps", "ischio-jambiers", "mollets",
    "Exercices-avec-sangles-de-suspension", "unilatéraux",
    "polyarticulaires", "monoarticulaires",
  ];

  // Fetch user ID from AsyncStorage
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

  // Fetch user info (specifically gender)
  useEffect(() => {
    if (userId && !gender) {
      dispatch(
        fetchUserInfoWithFields({
          userId,
          fields: ["gender"],  // Fetch only gender
        })
      ).then((res) => {
        if (res.payload?.gender) {
          setGender(res.payload.gender);
        }
      });
    }
  }, [userId, gender, dispatch]);

  // Fetch exercises for selected muscle group
  useEffect(() => {
    setLoadingExercises(true);
    if (!cachedExercises[selectedMuscleGroup]) {
      dispatch(fetchExercisesByMuscleGroup(selectedMuscleGroup))
        .then((res) => {
          setExercises(res.payload);
          setCachedExercises((prevCache) => ({
            ...prevCache,
            [selectedMuscleGroup]: res.payload,
          }));
          setLoadingExercises(false);
        })
        .catch(() => setLoadingExercises(false));
    } else {
      setExercises(cachedExercises[selectedMuscleGroup]);
      setLoadingExercises(false);
    }
  }, [dispatch, selectedMuscleGroup]);

  // Update exercise like/unlike statuses when data changes
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
          [selectedMuscleGroup]: updatedExercises,
        }));
      }).catch((error) => {
        console.error("Error fetching like/unlike statuses:", error);
      });
    }
  }, [exercisesData, userId, gender, dispatch]);

  const handleSelectExercise = (exercise) => {
    setSelectedExercises((prev) =>
      prev.includes(exercise)
        ? prev.filter((e) => e !== exercise)
        : [...prev, exercise]
    );
  };

  const handleMuscleGroupChange = (group) => {
    setSelectedMuscleGroup(group);
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
      setSelectedExercises([]);

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
      <Text style={styles.title}>Sélectionnez vos exercices de Musculation</Text>

      {/* Affichage des groupes musculaires */}
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

      {loadingExercises ? (
        <Text>Chargement des exercices...</Text>
      ) : (
        <FlatList
          data={exercises}
          renderItem={({ item }) => (
            <ExerciceCustomCard
              exercise={item}
              onSelectExercise={() => handleSelectExercise(item)}
              isSelected={selectedExercises.includes(item)}
              onLike={() => handleLikeExercise(item._id, userId, gender, dispatch, setExercises)}
              onUnlike={() => handleUnlikeExercise(item._id, userId, gender, dispatch, setExercises)}
              liked={item.isLiked === true}
              unliked={item.isUnliked === true}
            />
          )}
          keyExtractor={(item) => item._id}
          extraData={selectedExercises}
        />
      )}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleNextSession}
      >
        <Text style={styles.submitButtonText}>
          {currentSession === totalSessions ? "Terminer" : "Séance suivante"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MusculationScreen;
