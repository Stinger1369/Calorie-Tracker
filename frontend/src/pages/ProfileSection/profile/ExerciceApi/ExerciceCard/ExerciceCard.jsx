import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Importation des icônes FontAwesome
import styles from './ExerciseCardStyle';

const { width: screenWidth } = Dimensions.get('window');

// Fonction utilitaire pour tronquer le titre
const truncateTitle = (title) => {
  return title.length > 20 ? title.substring(0, 20) + '...' : title;
};

const ExerciseCard = ({ title, imageUrl, onPressDetails, onPressStart, repetitions, caloriesBurned, caloriesPerRep }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.contentContainer}>
        {imageUrl ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Pas d'image</Text>
          </View>
        )}
        <View style={styles.right}>
          <View style={styles.textContainer}>
            {/* Troncature du titre */}
            <Text style={styles.title}>{truncateTitle(title || 'Exercice')}</Text>
            <Text style={styles.detailsText}>Répétitions: {repetitions || 'N/A'}</Text>
            <Text style={styles.detailsText}>Calories dépensées: {caloriesBurned || 'N/A'}</Text>
            <Text style={styles.detailsText}>Calories par répétition: {caloriesPerRep || 'N/A'}</Text>
          </View>

          <View style={styles.buttonContainer}>
            {/* Start Exercise Button */}
            <TouchableOpacity style={styles.startButton} onPress={onPressStart}>
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>

            {/* Details Button */}
            <TouchableOpacity style={styles.detailsButton} onPress={onPressDetails}>
              <Text style={styles.buttonText}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Like and Dislike buttons */}
      <View style={styles.likeDislikeContainer}>
        <TouchableOpacity>
          <FontAwesome name="thumbs-up" size={24} color="green" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.dislikeButton}>
          <FontAwesome name="thumbs-down" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ExerciseCard;
