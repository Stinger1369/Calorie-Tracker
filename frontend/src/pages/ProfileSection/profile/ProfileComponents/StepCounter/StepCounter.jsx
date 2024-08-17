import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pedometer } from "expo-sensors";
import {
  fetchSteps,
  updateSteps,
} from "../../../../../redux/features/step/stepSlice";
import { View, Text, Button } from "react-native";

const StepCounter = ({ userId }) => {
  const dispatch = useDispatch();
  const { stepsHistory, status, error } = useSelector((state) => state.steps);
  const [currentSteps, setCurrentSteps] = useState(0);

  useEffect(() => {
    dispatch(fetchSteps(userId));

    // Activer le podomètre pour suivre les pas en temps réel
    const startPedometer = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (isAvailable) {
        Pedometer.watchStepCount((result) => {
          setCurrentSteps(result.steps);
        });
      } else {
        console.log("Le podomètre n'est pas disponible sur cet appareil.");
      }
    };

    startPedometer();
  }, [dispatch, userId]);

  const handleUpdateSteps = () => {
    const today = new Date();

    // Utiliser le nombre de pas actuel détecté par le podomètre
    const steps = currentSteps;

    dispatch(updateSteps({ userId, steps, date: today }));
  };

  return (
    <View>
      {status === "loading" && <Text>Chargement...</Text>}
      {status === "failed" && <Text>Erreur : {error}</Text>}
      {status === "succeeded" && (
        <>
          <Text>Historique des pas :</Text>
          {stepsHistory.map((entry) => (
            <Text key={entry.date}>
              {new Date(entry.date).toDateString()} : {entry.steps} pas
            </Text>
          ))}
        </>
      )}
      <Text>Pas actuels : {currentSteps}</Text>
      <Button title="Mettre à jour les pas" onPress={handleUpdateSteps} />
    </View>
  );
};

export default StepCounter;
