import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchExercisesByMuscleGroupAndTitle, toggleLikeOrUnlike } from "../../../../../redux/features/exerciseApi/exerciseApiSlice";
import { useNavigation } from "@react-navigation/native";
import styles from "./InsuffisantExerciceStyle";
import { getExercisesForSession } from "./InsuffisantExerciceData";
import ExerciseCard from '../ExerciceCard/ExerciceCard';
import moment from "moment";

const SessionInsuffisantExercice = ({ month }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loading, error, data: exercisesFromRedux } = useSelector((state) => state.exerciseApi);
  const { gender, _id: reduxUserId } = useSelector((state) => state.user.userInfo);
  const [currentSession, setCurrentSession] = useState(1);
  const [exercises, setExercises] = useState([]);
  const [cachedExercises, setCachedExercises] = useState({});
  const [startDate, setStartDate] = useState(moment());
  const [nextSessionDate, setNextSessionDate] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");
  const [userId, setUserId] = useState(reduxUserId || null);
  const [likedExercises, setLikedExercises] = useState({});

  useEffect(() => {
    console.log("[SessionInsuffisantExercice] exercises updated:", exercises);
  }, [exercises]);

  useEffect(() => {
    const fetchUserId = async () => {
      if (!reduxUserId) {
        try {
          const storedUserId = await AsyncStorage.getItem('userId');
          if (storedUserId !== null) {
            setUserId(storedUserId);
            console.log("Fetched userId from AsyncStorage:", storedUserId);
          }
        } catch (error) {
          console.error("Error fetching userId from AsyncStorage:", error);
        }
      }
    };

    fetchUserId();
  }, [reduxUserId]);

  useEffect(() => {
    if (cachedExercises[month]?.[currentSession]) {
      setExercises(cachedExercises[month][currentSession]);
      return;
    }

    const sessionExercises = getExercisesForSession(month, currentSession);

    const fetchExercisePromises = sessionExercises.map((exercise) => {
      return dispatch(fetchExercisesByMuscleGroupAndTitle({
        muscleGroup: exercise.muscleGroup,
        title: exercise.title
      }))
        .unwrap()
        .then((response) => {
          const exerciseData = response[0];
          const isLiked = exerciseData.like.user_ids[gender]?.includes(userId) || false;
          const isUnliked = exerciseData.unlike.user_ids[gender]?.includes(userId) || false;

          return {
            ...exerciseData,
            isLiked,
            isUnliked
          };
        })
        .catch((err) => {
          console.error(`Erreur lors de la récupération de l'exercice ${exercise.title}:`, err);
          return undefined;
        });
    });

    Promise.all(fetchExercisePromises)
      .then((resolvedExercises) => {
        const validExercises = resolvedExercises.filter(exercise => exercise !== undefined);
        setExercises(validExercises);

        setCachedExercises(prevCache => ({
          ...prevCache,
          [month]: { ...prevCache[month], [currentSession]: validExercises }
        }));
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des exercices:", err);
      });
  }, [currentSession, month, dispatch]); // Supprimé cachedExercises des dépendances pour éviter les boucles.

  const handleLike = (exerciseId) => {
    if (userId) {
      console.log(`User ${userId} is liking exercise: ${exerciseId}`);

      // Optimistic UI update
      setExercises((prevExercises) =>
        prevExercises.map((exercise) =>
          exercise._id === exerciseId ? { ...exercise, isLiked: true } : exercise
        )
      );

      const dataToSend = { exerciseId, actionType: 'like', userId, gender };

      dispatch(toggleLikeOrUnlike(dataToSend))
        .unwrap()
        .then((response) => {
          console.log(`Successfully liked exercise: ${exerciseId}`, response);

          setExercises((prevExercises) =>
            prevExercises.map((exercise) =>
              exercise._id === exerciseId ? { ...exercise, ...response.updatedExercise } : exercise
            )
          );
        })
        .catch((error) => {
          console.error(`Like failed for exercise: ${exerciseId}`, error);

          setExercises((prevExercises) =>
            prevExercises.map((exercise) =>
              exercise._id === exerciseId ? { ...exercise, isLiked: false } : exercise
            )
          );
        });
    }
  };

  const handleUnlike = (exerciseId) => {
    if (userId) {
      console.log(`User ${userId} is unliking exercise: ${exerciseId}`);

      // Optimistic UI update
      setExercises((prevExercises) =>
        prevExercises.map((exercise) =>
          exercise._id === exerciseId ? { ...exercise, isLiked: false } : exercise
        )
      );

      const dataToSend = { exerciseId, actionType: 'unlike', userId, gender };

      dispatch(toggleLikeOrUnlike(dataToSend))
        .unwrap()
        .then((response) => {
          console.log(`Successfully unliked exercise: ${exerciseId}`, response);

          setExercises((prevExercises) =>
            prevExercises.map((exercise) =>
              exercise._id === exerciseId ? { ...exercise, ...response.updatedExercise } : exercise
            )
          );
        })
        .catch((error) => {
          console.error(`Unlike failed for exercise: ${exerciseId}`, error);

          setExercises((prevExercises) =>
            prevExercises.map((exercise) =>
              exercise._id === exerciseId ? { ...exercise, isLiked: true } : exercise
            )
          );
        });
    }
  };

  const renderExerciseItem = ({ item }) => {
    const insuffisantReps = item?.Insuffisant_Reps || {};
    const repetitions = insuffisantReps.repetitions || 'N/A';
    const caloriesBurned = insuffisantReps.calories_depensée?.[gender] || insuffisantReps.calories_depensée?.other || 'N/A';
    const caloriesPerRep = insuffisantReps.calories_depense_repetition?.[gender] || insuffisantReps.calories_depense_repetition?.other || 'N/A';

    return (
      <ExerciseCard
        title={item?.title}
        imageUrl={item?.imageUrl}
        repetitions={repetitions}
        caloriesBurned={caloriesBurned}
        caloriesPerRep={caloriesPerRep}
        onPressDetails={() => navigation.navigate('ExerciseDetails', { exercise: item })}
        onPressStart={() => navigation.navigate('StartExerciseScreen', { exercise: item })}
        onLike={() => handleLike(item._id)}
        onUnlike={() => handleUnlike(item._id)}
        liked={item.isLiked}
        unliked={item.isUnliked}
      />
    );
  };

  const renderCategorySection = (title, data) => (
    <View>
      {data.length > 0 && <Text style={styles.categoryTitle}>{title}</Text>}
      <FlatList
        data={data}
        keyExtractor={(item) => item?._id || `${item.title}-${Math.random().toString()}`}
        numColumns={1}
        renderItem={renderExerciseItem}
        scrollEnabled={false}
      />
    </View>
  );

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
    <FlatList
      ListHeaderComponent={
        <View style={styles.container}>
          <View style={styles.sessionSwitcher}>
          <TouchableOpacity
  onPress={() => setCurrentSession(1)}
  style={[
    styles.sessionButton,
    currentSession === 1 ? styles.activeSessionButton : styles.inactiveSessionButton
  ]}
>
  <Text style={styles.buttonText}>Séance 1</Text>
</TouchableOpacity>
<TouchableOpacity
  onPress={() => setCurrentSession(2)}
  style={[
    styles.sessionButton,
    currentSession === 2 ? styles.activeSessionButton : styles.inactiveSessionButton
  ]}
>
  <Text style={styles.buttonText}>Séance 2</Text>
</TouchableOpacity>
<TouchableOpacity
  onPress={() => setCurrentSession(3)}
  style={[
    styles.sessionButton,
    currentSession === 3 ? styles.activeSessionButton : styles.inactiveSessionButton
  ]}
>
  <Text style={styles.buttonText}>Séance 3</Text>
</TouchableOpacity>

          </View>
        </View>
      }
      data={[]}
      ListFooterComponent={
        <View>
          {renderCategorySection("Cardio", exercises.filter(ex => ex.muscleGroup === "cardio"))}
          {renderCategorySection("Musculation", exercises.filter(ex => ex.muscleGroup !== "cardio" && ex.muscleGroup !== "Postures-de-yoga"))}
          {renderCategorySection("Yoga", exercises.filter(ex => ex.muscleGroup === "Postures-de-yoga"))}
        </View>
      }
    />
  );
};

export default SessionInsuffisantExercice;
