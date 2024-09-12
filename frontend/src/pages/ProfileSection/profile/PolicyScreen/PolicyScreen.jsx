import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Checkbox } from 'expo-checkbox';
import AsyncStorage from "@react-native-async-storage/async-storage"; // Pour gérer AsyncStorage
import styles from "./PolicyStyle";

const PolicyScreen = ({ navigation, route }) => {
  const [isChecked, setIsChecked] = useState(false);
  const { imc } = route.params; // Récupérer l'IMC depuis la route

  const handleAcceptPolicy = async () => {
    if (isChecked) {
      await AsyncStorage.setItem("hasAcceptedPolicy", 'true'); // Stocker l'acceptation dans AsyncStorage

      // Redirige directement vers l'écran d'exercices en fonction de l'IMC
      if (imc < 18.5) {
        navigation.navigate("InsuffisantExercice");
      } else if (imc >= 18.5 && imc < 24.9) {
        navigation.navigate("NormalExercice");
      } else if (imc >= 25 && imc < 29.9) {
        navigation.navigate("SurpoidsExercice");
      } else {
        navigation.navigate("ObesiteExercice");
      }
    } else {
      Alert.alert("Veuillez accepter la politique avant de continuer.");
    }
  };

  const handleRefusePolicy = () => {
    Alert.alert("Vous avez refusé les termes et conditions. Vous ne pourrez pas accéder aux exercices recommandés.");
    navigation.goBack(); // Revenir à l'écran précédent en cas de refus
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Politique et Conditions</Text>
        <Text style={styles.policyText}>
          Nous sommes là pour vous offrir des suggestions d'exercices basées sur vos informations de santé.
          Toutefois, ces suggestions sont à titre informatif et ne constituent pas un avis médical.
          En utilisant notre application, vous acceptez de suivre ces suggestions à votre propre discrétion.
          {"\n\n"}Nous ne sommes pas responsables des éventuelles blessures ou autres complications qui pourraient
          découler de l'utilisation de ces programmes d'exercices. Nous vous conseillons fortement de consulter
          un professionnel de santé avant de commencer toute nouvelle routine d'exercice, en particulier si vous
          avez des problèmes de santé préexistants.
          {"\n\n"}En cliquant sur "Accepter", vous confirmez avoir lu et compris ces termes, et vous assumez
          l'entière responsabilité de l'utilisation des exercices suggérés par notre application.
          {"\n\n"}Si vous refusez, vous ne pourrez pas accéder aux exercices recommandés.
        </Text>
      </ScrollView>

      <View style={styles.checkboxContainer}>
        <Checkbox
          value={isChecked}
          onValueChange={setIsChecked}
          style={styles.checkbox}
        />
        <Text style={styles.label}>J'accepte les termes et conditions</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, !isChecked && { backgroundColor: 'red' }]}
        onPress={handleAcceptPolicy}
      >
        <Text style={styles.buttonText}>
          {isChecked ? "Accepter et continuer" : "Accepter"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleRefusePolicy}>
        <Text style={styles.buttonText}>Refuser</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PolicyScreen;
