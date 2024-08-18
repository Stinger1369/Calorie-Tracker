import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

const ExerciseDetail = ({ route }) => {
  // Récupérer les détails de l'exercice depuis les paramètres de navigation
  const { exercise } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: exercise.gifUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.title}>{exercise.name}</Text>
      <Text style={styles.subtitle}>Target: {exercise.target}</Text>
      <Text style={styles.subtitle}>Body Part: {exercise.bodyPart}</Text>
      <Text style={styles.subtitle}>Equipment: {exercise.equipment}</Text>
      <Text style={styles.subtitle}>
        Secondary Muscles: {exercise.secondaryMuscles.join(", ")}
      </Text>
      <Text style={styles.instructionsTitle}>Instructions:</Text>
      {exercise.instructions.map((instruction, index) => (
        <Text key={index} style={styles.instruction}>
          {index + 1}. {instruction}
        </Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ExerciseDetail;
