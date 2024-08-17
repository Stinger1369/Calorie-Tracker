import React from "react";
import { View, Text } from "react-native";
import styles from "../ProfileStyles";

const KcalHistoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Historique des Calories</Text>
      {/* Ajoutez ici l'affichage des données de l'historique */}
    </View>
  );
};

export default KcalHistoryScreen;
