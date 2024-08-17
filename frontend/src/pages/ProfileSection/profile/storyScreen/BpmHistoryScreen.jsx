import React from "react";
import { View, Text } from "react-native";
import styles from "../ProfileStyles";

const BpmHistoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Historique des BPM</Text>
      {/* Ajoutez ici l'affichage des données de l'historique */}
    </View>
  );
};

export default BpmHistoryScreen;
