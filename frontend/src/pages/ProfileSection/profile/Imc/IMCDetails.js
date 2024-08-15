import React from "react";
import { View, Text, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useRoute } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import styles from "./IMCDetailsStyles";

const screenWidth = Dimensions.get("window").width;

const IMCDetails = () => {
  const route = useRoute();
  const { imc } = route.params;

  const getIMCMessage = () => {
    if (imc < 18.5) {
      return "Vous êtes en insuffisance pondérale. Il est recommandé de prendre du poids de manière saine.";
    } else if (imc >= 18.5 && imc < 24.9) {
      return "Votre IMC est normal. Continuez à maintenir un mode de vie sain.";
    } else if (imc >= 25 && imc < 29.9) {
      return "Vous êtes en surpoids. Il est conseillé de perdre du poids pour atteindre un IMC normal.";
    } else {
      return "Vous êtes en obésité. Il est fortement recommandé de consulter un professionnel de la santé pour obtenir des conseils.";
    }
  };

  const getAdviceImage = () => {
    if (imc < 18.5) {
      return require("./images/underweight.png");
    } else if (imc >= 18.5 && imc < 24.9) {
      return require("./images/normal.png");
    } else if (imc >= 25 && imc < 29.9) {
      return require("./images/overweight.png");
    } else {
      return require("./images/obesity.png");
    }
  };

  const data = {
    labels: ["Insuffisant", "Normal", "Surpoids", "Obésité"],
    datasets: [
      {
        data: [18.5, 24.9, 29.9, 35],
        colors: [
          () => "#FFA726",
          () => "#66BB6A",
          () => "#FFA726",
          () => "#EF5350",
        ],
      },
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Détails de l'IMC</Text>
      <Text style={styles.imcValue}>Votre IMC: {imc}</Text>
      <Text style={styles.advice}>{getIMCMessage()}</Text>

      {/* Graphique en Barres pour visualiser l'IMC */}
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

      {/* Image illustrative en fonction de l'IMC */}
      <FastImage source={getAdviceImage()} style={styles.adviceImage} />

      {/* Conseils supplémentaires */}
      <Text style={styles.advice}>
        {imc >= 25
          ? "Il est recommandé de faire de l'exercice régulièrement et de suivre une alimentation équilibrée."
          : "Continuez à maintenir un mode de vie actif et une alimentation saine."}
      </Text>
    </ScrollView>
  );
};

export default IMCDetails;
