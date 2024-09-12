import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import styles from './StartExerciseScreenStyle';

const StartExerciseScreen = ({ route }) => {
  const { exercise } = route.params;
  const [timeLeft, setTimeLeft] = useState(30); // Example timer set to 30 seconds

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  return (
    <View style={styles.container}>
      <Image source={{ uri: exercise.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{exercise.title}</Text>
      <Text style={styles.timer}>Time left: {timeLeft} seconds</Text>
    </View>
  );
};

export default StartExerciseScreen;
