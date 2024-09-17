import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import styles from "./CreateProgramScreenStyle";

const CreateProgramScreen = ({ navigation }) => {
  const [programName, setProgramName] = useState("");
  const [durationMonths, setDurationMonths] = useState("");
  const [sessionsPerWeek, setSessionsPerWeek] = useState("");

  const handleNextStep = () => {
    if (programName && durationMonths && sessionsPerWeek) {
      // Passer les données du programme à l'écran suivant pour choisir les exercices
      navigation.navigate("SelectExercisesScreen", {
        programName,
        durationMonths,
        sessionsPerWeek,
      });
    } else {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nom du Programme :</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez le nom du programme"
        value={programName}
        onChangeText={setProgramName}
      />

      <Text style={styles.label}>Nombre de mois :</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Entrez le nombre de mois"
        value={durationMonths}
        onChangeText={setDurationMonths}
      />

      <Text style={styles.label}>Séances par semaine :</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Entrez le nombre de séances"
        value={sessionsPerWeek}
        onChangeText={setSessionsPerWeek}
      />

      <TouchableOpacity style={styles.button} onPress={handleNextStep}>
        <Text style={styles.buttonText}>Suivant</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateProgramScreen;
