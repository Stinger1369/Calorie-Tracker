import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';  // Importation correcte du Picker
import styles from './StartExerciseScreenStyle';

const StartExerciseScreen = ({ route }) => {
  const { exercise } = route.params;
  const [timeLeft, setTimeLeft] = useState(30); // Exemple de timer défini à 30 secondes
  const [mode, setMode] = useState(null); // Mode choisi (répétition ou minute)
  const [repetitionCount, setRepetitionCount] = useState(10); // Nombre de répétitions sélectionné
  const [countdown, setCountdown] = useState(null); // Compteur pour le 3, 2, 1
  const [hasStarted, setHasStarted] = useState(false); // Flag pour savoir si le timer ou répétition a commencé

  // Fonction de mise à jour du timer quand il est lancé
  useEffect(() => {
    if (timeLeft > 0 && mode === 'minute' && hasStarted) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft, mode, hasStarted]);

  // Décrémenter le nombre de répétitions à chaque cycle
  useEffect(() => {
    if (repetitionCount > 0 && mode === 'repetition' && hasStarted) {
      const repetitionTimer = setTimeout(() => {
        setRepetitionCount(repetitionCount - 1); // Décrémenter les répétitions
      }, 1000); // Chaque répétition dure 1 seconde, tu peux ajuster cette valeur

      return () => clearTimeout(repetitionTimer);
    }
  }, [repetitionCount, mode, hasStarted]);

  // Fonction de démarrage du compte à rebours 3, 2, 1
  const startCountdown = () => {
    setCountdown(3); // Démarre à 3
    let countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(countdownInterval); // Arrêter le compte à rebours
          setHasStarted(true); // Démarrer l'exercice après le compte à rebours
          setCountdown(null); // Remettre à zéro le compte à rebours
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Affichage de l'image de l'exercice */}
      <View style={styles.imageBackground}>
        <Image source={{ uri: exercise.imageUrl }} style={styles.image} />
      </View>

      {/* Titre de l'exercice */}
      <Text style={styles.title}>{exercise.title}</Text>

      {/* Choix du mode */}
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

      {/* Si le mode répétition est choisi */}
      {mode === 'repetition' && (
        <View>
          <Text style={styles.subtitle}>Choisissez le nombre de répétitions :</Text>
          <Picker
            selectedValue={repetitionCount}
            style={styles.picker}
            onValueChange={(itemValue) => setRepetitionCount(itemValue)}
          >
            {[...Array(6).keys()].map(i => (
              <Picker.Item key={i} label={`${10 + i}`} value={10 + i} />
            ))}
          </Picker>
        </View>
      )}

      {/* Si le mode minute est choisi */}
      {mode === 'minute' && (
        <Text style={styles.timer}>Temps restant : {timeLeft} secondes</Text>
      )}

      {/* Compte à rebours */}
      {countdown && (
        <Text style={styles.countdown}>{countdown}</Text>
      )}

      {/* Bouton Start */}
      {!hasStarted && mode && (
        <TouchableOpacity style={styles.startButton} onPress={startCountdown}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      )}

      {/* Si le mode répétition est actif */}
      {mode === 'repetition' && hasStarted && (
        <Text style={styles.timer}>Répétitions restantes : {repetitionCount}</Text>
      )}

      {/* Si le mode minute est actif */}
      {mode === 'minute' && hasStarted && (
        <Text style={styles.timer}>Temps restant : {timeLeft} secondes</Text>
      )}
    </View>
  );
};

export default StartExerciseScreen;
