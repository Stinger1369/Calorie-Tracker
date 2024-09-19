import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fetchExercisesByMuscleGroup,
  fetchExercisesWithLikeStatus,
} from "../../../../../../../redux/features/exerciseApi/exerciseApiSlice";
import { fetchUserInfoWithFields } from "../../../../../../../redux/features/user/userSlice";
import ExerciceCustomCard from "../../ExerciceCustomCard/ExerciceCustomCard";
import { handleLikeExercise, handleUnlikeExercise } from "../../../../../../../utils/likeUtil";
import styles from "./CardioScreenStyles";  // Importation des styles

const CardioScreen = ({ navigation, route }) => {
  const {
    programName = "", // Valeur par défaut pour éviter l'erreur
    durationMonths = 0,
    sessionsPerWeek = 0,
    currentSession = 1,
    totalSessions = 0,
    sessions = []
  } = route?.params || {}; // Utilisation de valeurs par défaut si route.params est indéfini

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

  // Fetch exercises for "Cardio"
  useEffect(() => {
    setLoadingExercises(true);
    if (!cachedExercises["Cardio"]) {
      dispatch(fetchExercisesByMuscleGroup("Cardio"))
        .then((res) => {
          setExercises(res.payload);
          setCachedExercises((prevCache) => ({
            ...prevCache,
            Cardio: res.payload,
          }));
          setLoadingExercises(false);
        })
        .catch(() => setLoadingExercises(false));
    } else {
      setExercises(cachedExercises["Cardio"]);
      setLoadingExercises(false);
    }
  }, [dispatch]);

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
          Cardio: updatedExercises,
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
      <Text style={styles.title}>Sélectionnez vos exercices pour la séance {currentSession}</Text>
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

export default CardioScreen;
