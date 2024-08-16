import React, { useEffect } from 'react';
import { View, Text, ScrollView, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRecommendationsByCaloriesRange } from '../../../../../../redux/features/recommendation/recommendationSlice';
import styles from '../IMCAdviceStyles';

const Insuffisant = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    data: recommendations,
    loading,
    error,
  } = useSelector((state) => state.recommendations);

  useEffect(() => {
    dispatch(
      fetchRecommendationsByCaloriesRange({
        minCalories: 500,
        maxCalories: 2000,
      }),
    );
  }, [dispatch]);

  // Log pour voir les recettes récupérées
  useEffect(() => {
    if (!loading && recommendations.length > 0) {
      console.log('Recettes récupérées:');
      recommendations.forEach((recipe) => {
        console.log(`ID: ${recipe._id}`);
        console.log(`Titre: ${recipe.Title}`);
        console.log(
          `URL de l'image: http://localhost:3000/images/food/${recipe.ImageName}`,
        );
      });
    }
  }, [loading, recommendations]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Conseils pour Insuffisance Pondérale</Text>
      <Text style={styles.advice}>
        Il est recommandé d'augmenter votre apport calorique de manière saine en
        incluant plus de protéines, de glucides et de graisses saines. Consultez
        un nutritionniste pour un plan adapté.
      </Text>

      {loading && <Text>Chargement des recettes...</Text>}
      {error && <Text>Erreur: {error}</Text>}

      {!loading &&
        recommendations.map((recipe) => (
          <View key={recipe._id} style={styles.recipeContainer}>
            <Text style={styles.recipeTitle}>{recipe.Title}</Text>
            <Image
              source={{
                uri: `http://localhost:3000/images/food/${recipe.ImageName}`,
              }}
              style={styles.recipeImage}
            />
            {/* Ajout du nom de l'image */}
            <Text style={styles.recipeImageName}>{recipe.ImageName}</Text>
          </View>
        ))}

      <Button title="Retour" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
};

export default Insuffisant;
