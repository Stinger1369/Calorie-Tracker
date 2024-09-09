import React from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";

const PlaceholderImage = 'https://via.placeholder.com/150';

const ExerciseDetailsScreen = ({ route }) => {
  const { exercise } = route.params; // Get the exercise details from navigation params

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{exercise.title}</Text>
      <Image
        source={{ uri: exercise.imageUrl ? `${exercise.imageUrl}?ts=${Date.now()}` : PlaceholderImage }}
        style={styles.image}
      />
      <Text style={styles.description}>{exercise.description}</Text>
      <Text style={styles.instructionsTitle}>Instructions:</Text>
      <Text style={styles.instructions}>{exercise.instructions}</Text>
      <Text style={styles.tipsTitle}>Training Tips:</Text>
      <Text style={styles.tips}>{exercise.trainingTips}</Text>
    </ScrollView>
  );
};

export default ExerciseDetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tips: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
});
