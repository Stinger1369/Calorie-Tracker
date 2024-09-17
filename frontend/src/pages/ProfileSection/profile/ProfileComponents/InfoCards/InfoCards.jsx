import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { FontAwesome5 } from "@expo/vector-icons";
import styles from "./InfoCardsStyle";
import { useNavigation } from "@react-navigation/native";

const InfoCards = ({ userInfo }) => {
  const [containerWidth, setContainerWidth] = useState(0); // Largeur dynamique du conteneur
  const navigation = useNavigation();

  const generateData = () => {
    return {
      labels: ["", "", "", "", "", ""],
      datasets: [
        {
          data: [70, 60, 80, 75, 90, 74],
          color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    };
  };

  const chartConfig = {
    backgroundGradientFrom: "#2B1E45",
    backgroundGradientTo: "#2B1E45",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    useShadowColorFromDataset: false,
    propsForBackgroundLines: {
      stroke: "#444",
    },
  };

  // Capture la largeur réelle du conteneur
  const handleLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  return (
    <View style={styles.infoCardsContainer}>
      <View style={styles.leftColumn}>
        <TouchableOpacity
          style={styles.caloriesCard}
          onPress={() => navigation.navigate("KcalHistory")}
        >
          <FontAwesome5 name="fire" size={24} color="#FFA726" />
          <Text style={styles.infoCardValue}>
            {userInfo.recommendedCalories
              ? `${Math.round(userInfo.recommendedCalories)} Kcal`
              : "N/A"}
          </Text>
          <Text style={styles.infoCardTitle}>Needed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.stepsCard}
          onPress={() => navigation.navigate("StepsHistory")}
        >
          <FontAwesome5 name="walking" size={24} color="#7E57C2" />
          <Text style={styles.infoCardValue}>{userInfo.steps || "N/A"}</Text>
          <Text style={styles.infoCardTitle}>Steps</Text>
        </TouchableOpacity>
      </View>
      <View
        style={styles.rightColumn}
        onLayout={handleLayout} // Capture la largeur à l'intérieur de ce conteneur
      >
        <TouchableOpacity
          style={styles.bpmCard}
          onPress={() => navigation.navigate("BpmHistory")}
        >
          <View style={styles.heartHeader}>
            <Text style={styles.heartTitle}>Heart</Text>
            <FontAwesome5 name="heartbeat" size={18} color="#FF69B4" />
          </View>
         {containerWidth > 0 && (
  <LineChart
    data={generateData()}
    width={containerWidth} // Ajusté pour correspondre au conteneur
    height={170}
    chartConfig={{
      ...chartConfig,
      color: (opacity = 1) => `rgba(255, 105, 180, ${opacity})`,
      labelColor: () => `rgba(255, 255, 255, 0.5)`,
      propsForDots: {
        r: "2",
        strokeWidth: "2",
      },
      propsForBackgroundLines: {
        strokeDasharray: "",
      },
    }}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 16,
    }}
  />
)}

          <Text style={styles.heartRateValue}>74 bpm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InfoCards;
