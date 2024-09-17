import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Checkbox } from 'expo-checkbox';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { updatePolicyAcceptance } from "../../../../redux/features/user/userSlice";
import styles from "./PolicyStyle";

const PolicyScreen = ({ navigation, route }) => {
  const [isChecked, setIsChecked] = useState(false);
  const { imc, userId } = route.params; // Retrieve userId from route params
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    console.log('User Info (PolicyScreen):', userInfo);
    console.log('User ID from route params:', userId);
  }, [userInfo, userId]);

  const handleAcceptPolicy = async () => {
    if (!userId) {
      Alert.alert("Error", "User ID is missing. Cannot accept policy.");
      return;
    }

    if (isChecked) {
      // Update policy acceptance in the database via Redux
      dispatch(updatePolicyAcceptance({ userId, hasAcceptedPolicy: true }));

      await AsyncStorage.setItem("hasAcceptedPolicy", 'true'); // Store acceptance in AsyncStorage

      // Navigate to exercise screen based on IMC
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
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Politique et Conditions</Text>
        <Text style={styles.policyText}>
          Nous sommes là pour vous offrir des suggestions d'exercices basées sur vos informations de santé.
          Toutefois, ces suggestions sont à titre informatif et ne constituent pas un avis médical.
          {"\n\n"}Nous ne sommes pas responsables des éventuelles blessures ou autres complications qui pourraient
          découler de l'utilisation de ces programmes d'exercices.
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
