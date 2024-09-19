import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, Modal, TouchableOpacity, Dimensions } from "react-native";
import { styles } from './ExerciseDetailsScreenStyle';

const PlaceholderImage = 'https://via.placeholder.com/150';

// Get the screen width dynamically
const { width: screenWidth } = Dimensions.get('window');

const ExerciseDetailsScreen = ({ route }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const { exercise } = route.params || {};

  const {
    title = "Exercice sans titre",
    imageUrl,
    description = "Pas de description disponible.",
    instructions = "Aucune instruction fournie.",
    trainingTips = "Aucun conseil fourni.",
    Insuffisant_Reps = {},
    Normal_Reps = {},
    Surpoids_Reps = {},
    Obese_Reps = {},
  } = exercise || {};

  // Fonction pour afficher une liste d'éléments séparés par un pipe "|"
  const renderList = (text) => {
    return text.split('|').map((item, index) => (
      <Text key={index} style={styles.listItem}>• {item.trim()}</Text>
    ));
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
      <Text style={styles.title}>{title}</Text>

      {/* Image touchable pour ouvrir un modal */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
          source={{ uri: imageUrl ? `${imageUrl}?ts=${Date.now()}` : PlaceholderImage }}
          style={[styles.image, { width: screenWidth - 40, height: (screenWidth - 40) * 0.75 }]} // Ajustement dynamique de la taille de l'image
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Modal pour afficher l'image en plein écran */}
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.modalCloseText}>Fermer</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: imageUrl ? `${imageUrl}?ts=${Date.now()}` : PlaceholderImage }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </View>
      </Modal>

      {/* Description de l'exercice */}
      <Text style={styles.description}>{description}</Text>

      {/* Instructions de l'exercice */}
      <Text style={styles.instructionsTitle}>Instructions:</Text>
      {renderList(instructions)}

      {/* Conseils d'entraînement */}
      <Text style={styles.tipsTitle}>Conseils d'entraînement:</Text>
      {renderList(trainingTips)}

      {/* Informations sur les répétitions selon différentes catégories */}
      <View style={styles.repsContainer}>
        <Text style={styles.repsTitle}>Répétitions pour IMC insuffisant :</Text>
        <Text style={styles.repsText}>Répétitions : {Insuffisant_Reps.repetitions || 'N/A'}</Text>
        <Text style={styles.repsText}>Calories dépensées : {Insuffisant_Reps.calories_depensée?.male || 'N/A'} kcal</Text>
        <Text style={styles.repsText}>Calories par répétition : {Insuffisant_Reps.calories_depense_repetition?.male || 'N/A'} kcal</Text>
      </View>

      <View style={styles.repsContainer}>
        <Text style={styles.repsTitle}>Répétitions pour IMC normal :</Text>
        <Text style={styles.repsText}>Répétitions : {Normal_Reps.repetitions || 'N/A'}</Text>
        <Text style={styles.repsText}>Calories dépensées : {Normal_Reps.calories_depensée?.male || 'N/A'} kcal</Text>
        <Text style={styles.repsText}>Calories par répétition : {Normal_Reps.calories_depense_repetition?.male || 'N/A'} kcal</Text>
      </View>

      <View style={styles.repsContainer}>
        <Text style={styles.repsTitle}>Répétitions pour surpoids :</Text>
        <Text style={styles.repsText}>Répétitions : {Surpoids_Reps.repetitions || 'N/A'}</Text>
        <Text style={styles.repsText}>Calories dépensées : {Surpoids_Reps.calories_depensée?.male || 'N/A'} kcal</Text>
        <Text style={styles.repsText}>Calories par répétition : {Surpoids_Reps.calories_depense_repetition?.male || 'N/A'} kcal</Text>
      </View>

      <View style={styles.repsContainer}>
        <Text style={styles.repsTitle}>Répétitions pour obèse :</Text>
        <Text style={styles.repsText}>Répétitions : {Obese_Reps.repetitions || 'N/A'}</Text>
        <Text style={styles.repsText}>Calories dépensées : {Obese_Reps.calories_depensée?.male || 'N/A'} kcal</Text>
        <Text style={styles.repsText}>Calories par répétition : {Obese_Reps.calories_depense_repetition?.male || 'N/A'} kcal</Text>
      </View>
    </ScrollView>
  );
};

export default ExerciseDetailsScreen;
