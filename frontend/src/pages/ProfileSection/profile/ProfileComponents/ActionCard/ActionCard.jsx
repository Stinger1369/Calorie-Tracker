import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./ActionCardStyle"; // Import specific styles for ActionCard

const ActionCard = ({ userInfo, onIMCPress }) => (
  <>
    <View style={styles.actionCard}>
      <Text style={styles.actionText}>Invite your friends</Text>
      <Text style={styles.actionSubText}>
        Invite your friends to get a free exercise right away
      </Text>
    </View>
    <TouchableOpacity onPress={onIMCPress} style={styles.imcContainer}>
      <Text style={styles.imcText}>
        Height: {userInfo.height} cm | Weight: {userInfo.weight} kg | IMC:{" "}
        {userInfo.bmi}
      </Text>
    </TouchableOpacity>
  </>
);

export default ActionCard;
