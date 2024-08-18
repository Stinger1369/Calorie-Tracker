import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchExercises } from "../../../../redux/features/exerciseApi/exerciseApiSlice";

const ObesiteExercice = () => {
  const dispatch = useDispatch();
  const { exercises, loading, error } = useSelector(
    (state) => state.exerciseApi
  );

  useEffect(() => {
    dispatch(fetchExercises());
  }, [dispatch]);

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
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={exercises} // Filtrer pour les exercices intenses ici si besoin
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.exerciseContainer}>
          <Text style={styles.exerciseName}>{item.name}</Text>
          <Text style={styles.exerciseDetail}>Target: {item.target}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  exerciseContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  exerciseDetail: {
    fontSize: 14,
    color: "#666",
  },
});

export default ObesiteExercice;
