import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import RepetitionPicker from './RepetitionPicker/RepetitionPicker';
import MinutePicker from './MinutePicker/MinutePicker';
import styles from './StartExerciseScreenStyle';

const StartExerciseScreen = ({ route }) => {
  const { exercise } = route.params;
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedMinutes, setSelectedMinutes] = useState(1);
  const [mode, setMode] = useState(null);
  const [repetitionCount, setRepetitionCount] = useState(10);
  const [multiplier, setMultiplier] = useState(1);
  const [finalRepetitionCount, setFinalRepetitionCount] = useState(10);
  const [countdown, setCountdown] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Utilisation de useEffect pour gérer setTimeout proprement
  useEffect(() => {
    let timeout;
    if (isFinished) {
      timeout = setTimeout(() => {
        setIsFinished(true);
      }, 3000);
    }

    // Nettoyage du timeout si le composant est démonté ou que l'exercice change
    return () => clearTimeout(timeout);
  }, [isFinished]);

  const startCountdown = () => {
    setCountdown(3);
    let countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          setHasStarted(true);
          setCountdown(null);
          setIsFinished(false);

          if (mode === 'repetition') {
            const timePerRep = 0.7; // Durée par répétition (0.7 seconde par répétition)
            const totalReps = repetitionCount * multiplier; // Calcul du nombre total de répétitions
            setFinalRepetitionCount(totalReps);
            setTimeLeft(Math.ceil(totalReps * timePerRep)); // Calculer le temps total en secondes
          } else if (mode === 'minute') {
            setTimeLeft(selectedMinutes * 60);
          }

          // Mise à jour de l'état pour démarrer le timer avec le nouveau timeout géré par useEffect
          setIsFinished(true);
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (hasStarted && !isPaused && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }

    if (timeLeft === 0 && hasStarted) {
      setIsFinished(true);
    }
  }, [hasStarted, isPaused, timeLeft]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const resetExercise = () => {
    setHasStarted(false);
    setIsPaused(false);
    setTimeLeft(30);
    setFinalRepetitionCount(10);
    setCountdown(null);
    setIsFinished(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageBackground}>
        <Image source={{ uri: exercise.imageUrl }} style={styles.image} />
      </View>

      <Text style={styles.title}>{exercise.title}</Text>

      <Text style={styles.subtitle}>Choisissez votre mode :</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, mode === 'repetition' && styles.selectedButton]}
          onPress={() => setMode('repetition')}
        >
          <Text style={styles.buttonText}>Par répétition</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, mode === 'minute' && styles.selectedButton]}
          onPress={() => setMode('minute')}
        >
          <Text style={styles.buttonText}>Par minute</Text>
        </TouchableOpacity>
      </View>

      {mode === 'repetition' && (
        <RepetitionPicker
          repetitionCount={repetitionCount}
          setRepetitionCount={setRepetitionCount}
          multiplier={multiplier}
          setMultiplier={setMultiplier}
        />
      )}

      {mode === 'minute' && (
        <MinutePicker
          selectedMinutes={selectedMinutes}
          setSelectedMinutes={setSelectedMinutes}
        />
      )}

      {countdown && <Text style={styles.countdown}>{countdown}</Text>}

      {!hasStarted && mode && (
        <TouchableOpacity style={styles.startButton} onPress={startCountdown}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      )}

      {mode === 'repetition' && hasStarted && (
        <Text style={styles.timer}>
          Répétitions restantes : {Math.ceil(timeLeft / 0.7)} {/* Convertir en répétitions restantes */}
        </Text>
      )}

      {mode === 'minute' && hasStarted && (
        <Text style={styles.timer}>Temps restant : {timeLeft} secondes</Text>
      )}

      {hasStarted && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.pauseButton} onPress={togglePause}>
            <Text style={styles.buttonText}>{isPaused ? 'Resume' : 'Pause'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={resetExercise}>
            <Text style={styles.buttonText}>Recommencer</Text>
          </TouchableOpacity>

          {isFinished && (
            <TouchableOpacity style={styles.validateButton}>
              <Text style={styles.buttonText}>Valider</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default StartExerciseScreen;
