import React from "react";
import { View, Text, ScrollView, Image, Button } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import styles from "./IMCDetailsStyles";

const screenWidth = Dimensions.get("window").width;

const IMCDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { imc } = route.params;

  const getIMCMessage = () => {
    if (imc < 18.5) {
      return "Vous êtes en insuffisance pondérale. Il est recommandé de prendre du poids de manière saine.";
    } else if (imc >= 18.5 && imc < 24.9) {
      return "Votre IMC est normal. Continuez à maintenir un mode de vie sain et n’hésitez pas à suivre nos conseils pour rester en forme.";
    } else if (imc >= 25 && imc < 29.9) {
      return "Vous êtes en surpoids. Il est conseillé de perdre du poids pour atteindre un IMC normal en adoptant une alimentation équilibrée et en faisant de l'exercice.";
    } else {
      return "Vous êtes en obésité. Il est fortement recommandé de consulter un professionnel de la santé pour obtenir des conseils personnalisés et de suivre un plan de vie sain.";
    }
  };

 const getAdviceImage = () => {
  if (imc < 18.5) {
    return { uri: "http://82.66.65.151:7000/images/front/underweight.png" };
  } else if (imc >= 18.5 && imc < 24.9) {
    return { uri: "http://82.66.65.151:7000/images/front/normal.png" };
  } else if (imc >= 25 && imc < 29.9) {
    return { uri: "http://82.66.65.151:7000/images/front/overweight.png" };
  } else {
    return { uri: "http://82.66.65.151:7000/images/front/obesity.png" };
  }
};


  const getIMCIndex = () => {
    if (imc < 18.5) {
      return 0; // Insuffisant
    } else if (imc >= 18.5 && imc < 24.9) {
      return 1; // Normal
    } else if (imc >= 25 && imc < 29.9) {
      return 2; // Surpoids
    } else {
      return 3; // Obésité
    }
  };

  const imcIndex = getIMCIndex();

  const labels = ["Insuffisant", "Normal", "Surpoids", "Obésité"];
  labels[imcIndex] += " (You)";

  const data = {
    labels: labels,
    datasets: [
      {
        data: [18.5, 24.9, 29.9, 35],
        colors: [
          (opacity = 1) =>
            imcIndex === 0
              ? `rgba(255, 167, 38, ${opacity})`
              : `rgba(192, 192, 192, ${opacity})`,
          (opacity = 1) =>
            imcIndex === 1
              ? `rgba(102, 187, 106, ${opacity})`
              : `rgba(192, 192, 192, ${opacity})`,
          (opacity = 1) =>
            imcIndex === 2
              ? `rgba(255, 167, 38, ${opacity})`
              : `rgba(192, 192, 192, ${opacity})`,
          (opacity = 1) =>
            imcIndex === 3
              ? `rgba(239, 83, 80, ${opacity})`
              : `rgba(192, 192, 192, ${opacity})`,
        ],
      },
    ],
  };

  const navigateToAdviceScreen = () => {
    if (imc < 18.5) {
      navigation.navigate("Insuffisant");
    } else if (imc >= 18.5 && imc < 24.9) {
      navigation.navigate("Normal");
    } else if (imc >= 25 && imc < 29.9) {
      navigation.navigate("Surpoids");
    } else {
      navigation.navigate("Obesite");
    }
  };

  const getAdditionalAdvice = () => {
    if (imc < 18.5) {
      return "Il est conseillé d'augmenter votre apport calorique en privilégiant des aliments riches en nutriments.";
    } else if (imc >= 18.5 && imc < 24.9) {
      return "Même avec un IMC normal, il est important de maintenir une alimentation équilibrée et de rester actif pour préserver votre santé à long terme.";
    } else if (imc >= 25 && imc < 29.9) {
      return "Adopter une routine d'exercice régulière et réduire les calories superflues peut aider à atteindre un poids plus sain.";
    } else {
      return "Suivre un plan personnalisé de régime et d'exercice, sous la supervision d'un professionnel de santé, est crucial pour améliorer votre bien-être.";
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Détails de l'IMC</Text>
      <Text style={styles.imcValue}>Votre IMC: {imc}</Text>
      <Text style={styles.advice}>{getIMCMessage()}</Text>

      <BarChart
        data={data}
        width={screenWidth - 40}
        height={220}
        fromZero={true}
        showValuesOnTopOfBars={true}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={styles.chartStyle}
      />

      <Image source={getAdviceImage()} style={styles.adviceImage} />

      <Text style={styles.advice}>{getAdditionalAdvice()}</Text>

      {/* Bouton pour naviguer vers l'écran de conseils */}
      <Button
        title="Voir les conseils personnalisés"
        onPress={navigateToAdviceScreen}
      />
    </ScrollView>
  );
};

export default IMCDetails;
