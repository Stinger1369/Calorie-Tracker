import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchExercises } from "../../../../redux/features/exerciseApi/exerciseApiSlice";
import { useNavigation } from "@react-navigation/native";

const InsuffisantExercice = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
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
      key={"_"}
      data={exercises}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2} // Affiche les éléments en 2 colonnes
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.exerciseContainer}
          onPress={() =>
            navigation.navigate("ExerciseDetail", { exercise: item })
          } // Navigation vers l'écran de détails avec les données de l'exercice
        >
          <Image
            source={{ uri: item.gifUrl }}
            style={styles.exerciseImage}
            resizeMode="cover"
          />
          <Text style={styles.exerciseName}>{item.name}</Text>
        </TouchableOpacity>
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
    flex: 1,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
  },
  exerciseImage: {
    width: 240,
    height: 240,
    borderRadius: 10,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
});

export default InsuffisantExercice;
