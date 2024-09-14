import React, { memo, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from './ExerciseCardStyle';

const { width: screenWidth } = Dimensions.get('window');

const ExerciseCard = ({
  title,
  imageUrl,
  onPressDetails,
  onPressStart,
  repetitions,
  caloriesBurned,
  caloriesPerRep,
  onLike,
  onUnlike,
  liked,
  unliked
}) => {
  console.log("ExerciseCard rendered for:", title, "Liked state:", liked, "Unliked state:", unliked);

  const handlePressStart = useCallback(() => {
    onPressStart();
  }, [onPressStart]);

  const handlePressDetails = useCallback(() => {
    onPressDetails();
  }, [onPressDetails]);

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
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.detailsText}>Répétitions: {repetitions || 'N/A'}</Text>
            <Text style={styles.detailsText}>Calories dépensées: {caloriesBurned || 'N/A'}</Text>
            <Text style={styles.detailsText}>Calories par répétition: {caloriesPerRep || 'N/A'}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.startButton} onPress={handlePressStart}>
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailsButton} onPress={handlePressDetails}>
              <Text style={styles.buttonText}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Like and Unlike buttons with default colors and interaction logic */}
      <View style={styles.likeDislikeContainer}>
        {/* Like button is green by default, turns gray when liked */}
        <TouchableOpacity onPress={handleLike} disabled={liked}>
<FontAwesome name="thumbs-up" size={24} color={liked ? "gray" : "green"} />
        </TouchableOpacity>

        {/* Unlike button is red by default, turns gray when unliked */}
        <TouchableOpacity onPress={handleUnlike} disabled={unliked} style={styles.dislikeButton}>
<FontAwesome name="thumbs-down" size={24} color={unliked ? "gray" : "red"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(ExerciseCard);
