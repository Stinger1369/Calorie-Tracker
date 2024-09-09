import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchExercisesByMuscleGroup, fetchMuscleGroups } from "../../../../../../redux/features/exerciseApi/exerciseApiSlice";
import styles from "./exerciseListStyles";

const PlaceholderImage = 'https://via.placeholder.com/150';

const ExerciseListScreen = ({ route, navigation }) => {
  const { muscleGroup } = route.params; // Get the muscle group from navigation params
  const dispatch = useDispatch();
  const { loading, error, muscleGroups } = useSelector((state) => state.exerciseApi);
  const [groupExercises, setGroupExercises] = useState([]);

  useEffect(() => {
    // Fetch exercises for the specific muscle group
    dispatch(fetchExercisesByMuscleGroup(muscleGroup))
      .unwrap()
      .then((exercises) => setGroupExercises(exercises))
      .catch((err) => console.error(err));
  }, [dispatch, muscleGroup]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      // Fetch exercises again when navigating back
      dispatch(fetchMuscleGroups());
    });

    return unsubscribe; // Cleanup listener on unmount
  }, [navigation, dispatch]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  const handleExercisePress = (exercise) => {
    navigation.navigate('ExerciseDetails', { exercise });
  };

  const renderExercises = () => {
    const rows = [];
    for (let i = 0; i < groupExercises.length; i += 2) {
      const exercise1 = groupExercises[i];
      const exercise2 = groupExercises[i + 1];
      rows.push(
        <View key={i} style={styles.exerciseRow}>
          <TouchableOpacity onPress={() => handleExercisePress(exercise1)} style={styles.exerciseItem}>
            <Text style={styles.exerciseTitle}>{exercise1.title}</Text>
            {exercise1.imageUrl ? (
              <Image
                source={{ uri: `${exercise1.imageUrl}?ts=${Date.now()}` }}
                style={styles.exerciseImage}
                onError={() => console.error(`Failed to load image for ${exercise1.title}`)}
              />
            ) : (
              <Image source={{ uri: PlaceholderImage }} style={styles.exerciseImage} />
            )}
          </TouchableOpacity>
          {exercise2 && (
            <TouchableOpacity onPress={() => handleExercisePress(exercise2)} style={styles.exerciseItem}>
              <Text style={styles.exerciseTitle}>{exercise2.title}</Text>
              {exercise2.imageUrl ? (
                <Image
                  source={{ uri: `${exercise2.imageUrl}?ts=${Date.now()}` }}
                  style={styles.exerciseImage}
                  onError={() => console.error(`Failed to load image for ${exercise2.title}`)}
                />
              ) : (
                <Image source={{ uri: PlaceholderImage }} style={styles.exerciseImage} />
              )}
            </TouchableOpacity>
          )}
        </View>
      );
    }
    return rows;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{muscleGroup} Exercises</Text>
      {renderExercises()}
    </ScrollView>
  );
};

export default ExerciseListScreen;
