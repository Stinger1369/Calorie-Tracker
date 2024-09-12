import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchExercisesByMuscleGroupAndTitle } from "../../../../../redux/features/exerciseApi/exerciseApiSlice";
import { useNavigation } from "@react-navigation/native";
import styles from "./InsuffisantExerciceStyle";
import { getExercisesForSession } from "./InsuffisantExerciceData";
import ExerciseCard from '../ExerciceCard/ExerciceCard';
import moment from "moment";

const SessionInsuffisantExercice = ({ month }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loading, error } = useSelector((state) => state.exerciseApi);
  const { gender } = useSelector((state) => state.user.userInfo);

  const [currentSession, setCurrentSession] = useState(1);
  const [exercises, setExercises] = useState([]);
  const [startDate, setStartDate] = useState(moment());
  const [nextSessionDate, setNextSessionDate] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");

useEffect(() => {
  const sessionExercises = getExercisesForSession(month, currentSession);

  const fetchExercisePromises = sessionExercises.map((exerciseTitle) => {
    return dispatch(fetchExercisesByMuscleGroupAndTitle(exerciseTitle))
      .unwrap()
      .then((response) => response[0])
      .catch((err) => {
        console.error(`Error fetching exercise ${exerciseTitle}:`, err);
        return undefined; // Retourner undefined en cas d'erreur pour éviter les erreurs futures
      });
  });

  Promise.all(fetchExercisePromises)
    .then((resolvedExercises) => {
      // Filtrer les exercices valides (pas undefined) avant de créer la Map
      const validExercises = resolvedExercises.filter(exercise => exercise !== undefined);

      const uniqueExercises = Array.from(
        new Map(validExercises.map((exercise) => [exercise._id, exercise])).values()
      );

      setExercises(uniqueExercises);
    })
    .catch((err) => {
      console.error("Error fetching exercises:", err);
    });
}, [currentSession, dispatch, month]);


  useEffect(() => {
    const dayOffset = (currentSession - 1) * 2;
    const nextDate = moment(startDate).add(dayOffset, 'days');
    setNextSessionDate(nextDate.format('dddd, MMMM Do'));
    calculateCountdown(nextDate);
  }, [startDate, currentSession]);

  const calculateCountdown = (nextDate) => {
    const now = moment();
    const diff = moment(nextDate).diff(now);
    const duration = moment.duration(diff);
    setTimeRemaining(`${duration.days()} jours ${duration.hours()}h ${duration.minutes()}m`);
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
          <Text style={styles.monthText}>
            Mois {month} - Séance {currentSession} (Prochaine séance : {nextSessionDate})
          </Text>
          <Text style={styles.countdownText}>Temps restant : {timeRemaining}</Text>

          <View style={styles.sessionSwitcher}>
            <TouchableOpacity onPress={() => setCurrentSession(1)} style={styles.sessionButton}>
              <Text style={styles.buttonText}>Séance 1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentSession(2)} style={styles.sessionButton}>
              <Text style={styles.buttonText}>Séance 2</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentSession(3)} style={styles.sessionButton}>
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
