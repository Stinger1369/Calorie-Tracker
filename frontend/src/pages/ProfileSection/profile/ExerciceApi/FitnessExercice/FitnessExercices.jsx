import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchExercises, fetchMuscleGroups } from "../../../../../redux/features/exerciseApi/exerciseApiSlice";
import styles from "./fitnessExercicesStyles";
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const PlaceholderImage = 'https://via.placeholder.com/150';

const FitnessExercices = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { data: exercises, loading, error } = useSelector((state) => state.exerciseApi);

  const [randomExerciseByGroup, setRandomExerciseByGroup] = useState({});
  const [imageLoadFailures, setImageLoadFailures] = useState({});

  // Fetch all exercises on mount
  useEffect(() => {
    dispatch(fetchExercises());
    dispatch(fetchMuscleGroups()); // Fetch muscle groups on component mount
  }, [dispatch]);

  // Refetch data when navigating back
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(fetchExercises());
      dispatch(fetchMuscleGroups()); // Fetch muscle groups again when navigating back
    });

    return unsubscribe;
  }, [navigation, dispatch]);

  // Group exercises by muscle group when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (exercises.length > 0) {
        const groupedExercises = {};
        exercises.forEach((exercise) => {
          const muscleGroup = exercise.muscleGroup;
          if (!groupedExercises[muscleGroup]) {
            groupedExercises[muscleGroup] = [];
          }
          groupedExercises[muscleGroup].push(exercise);
        });

        const randomExercises = {};
        Object.keys(groupedExercises).forEach((group) => {
          const groupExercises = groupedExercises[group];
          const randomExercise = groupExercises[Math.floor(Math.random() * groupExercises.length)];
          randomExercises[group] = randomExercise;
        });

        setRandomExerciseByGroup(randomExercises);
      }

      return () => {
        // Clean up: reset the state when leaving the screen
        setRandomExerciseByGroup({});
      };
    }, [exercises])
  );

  const handleImageError = (group) => {
    setImageLoadFailures((prevFailures) => ({
      ...prevFailures,
      [group]: true,
    }));
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const renderMuscleGroupsWithImage = () => {
    return (
      <View style={styles.muscleGroupContainer}>
        {Object.keys(randomExerciseByGroup).map((group, index) => {
          const exercise = randomExerciseByGroup[group];
          const hasFailed = imageLoadFailures[group];

          return (
            <TouchableOpacity
              key={index}
              style={styles.muscleGroupItem}
              onPress={() => navigation.navigate('ExerciseListScreen', { muscleGroup: group })}
            >
              <Text style={styles.muscleGroupTitle}>{group}</Text>
              {exercise && exercise.imageUrl ? (
                <Image
                  source={{ uri: hasFailed ? PlaceholderImage : `${exercise.imageUrl}?ts=${Date.now()}` }}
                  style={styles.exerciseImage}
                  onError={() => handleImageError(group)}
                  resizeMode="cover"
                />
              ) : (
                <Text>No image available</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Muscle Groups</Text>
      {renderMuscleGroupsWithImage()}
    </ScrollView>
  );
};

export default FitnessExercices;
