import React from "react";
import { View, Text, FlatList } from "react-native";
import { useSelector } from "react-redux";
import styles from "../ProfileStyles";

const StepsHistoryScreen = () => {
  const { stepsHistory } = useSelector((state) => state.steps);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Historique des Pas</Text>
      <FlatList
        data={stepsHistory}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text>{new Date(item.date).toDateString()}</Text>
            <Text>{item.steps} pas</Text>
          </View>
        )}
      />
    </View>
  );
};

export default StepsHistoryScreen;
