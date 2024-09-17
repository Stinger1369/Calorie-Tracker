import React, { useCallback } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from './ExerciceCustomCardStyle';

const ExerciceCustomCard = ({ exercise, onSelectExercise, isSelected, onLike, onUnlike, liked, unliked }) => {
  const {
    title,
    imageUrl,
    Normal_Reps,
    like,
    unlike
  } = exercise;

  // Assuming you want to show Normal Reps info
  const repsInfo = Normal_Reps;

  const handleLike = useCallback(() => {
    if (!liked) {
      onLike();
    }
  }, [onLike, liked]);

  const handleUnlike = useCallback(() => {
    if (!unliked) {
      onUnlike();
    }
  }, [onUnlike, unliked]);

  return (
    <TouchableOpacity
      style={[styles.cardContainer, isSelected ? styles.selectedCard : null]}
      onPress={onSelectExercise}
    >
      <View style={styles.contentContainer}>
        {/* Image on the left */}
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

        {/* Text content on the right */}
        <View style={styles.right}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.detailsText}>Répétitions: {repsInfo.repetitions || 'N/A'}</Text>
            <Text style={styles.detailsText}>Calories dépensées: {repsInfo.calories_depensée.male || 'N/A'} kcal</Text>
            <Text style={styles.detailsText}>Calories par répétition: {repsInfo.calories_depense_repetition.male || 'N/A'} kcal</Text>
          </View>

          {/* Likes and Unlikes Section */}
          <View style={styles.likeDislikeContainer}>
            <TouchableOpacity onPress={handleLike} disabled={liked}>
              <FontAwesome name="thumbs-up" size={24} color={liked ? "gray" : "green"} />
              <Text>{like?.count?.male || 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleUnlike} disabled={unliked} style={styles.dislikeButton}>
              <FontAwesome name="thumbs-down" size={24} color={unliked ? "gray" : "red"} />
              <Text>{unlike?.count?.male || 0}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ExerciceCustomCard;
