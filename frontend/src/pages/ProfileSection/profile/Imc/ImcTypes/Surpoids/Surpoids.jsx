import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { fetchRecommendationsByCaloriesRange } from "../../../../../../redux/features/recommendation/recommendationSlice";
import styles from "./SurpoidsStyle";
import { getHostname } from "../../../../../../hostname";

// Fonction pour tronquer le titre après les deux premiers mots
const truncateTitle = (title) => {
  const words = title.split(" ");
  if (words.length > 2) {
    return `${words.slice(0, 2).join(" ")}...`;
  }
  return title;
};

const Surpoids = () => {
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
        minCalories: 100,
        maxCalories: 450,
      })
    );
  }, [dispatch]);

  // Log pour voir les recettes récupérées
  useEffect(() => {
    if (!loading && recommendations.length > 0) {
      console.log("Recettes récupérées:");
      recommendations.forEach((recipe) => {
        const imageUrl = `${getHostname()}/images/food/${recipe.ImageName}`;
        console.log(`ID: ${recipe._id}`);
        console.log(`Titre: ${recipe.Title}`);
        console.log(`URL de l'image: ${imageUrl}`);
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

      <View style={styles.gridContainer}>
        {!loading &&
          recommendations.map((recipe) => (
            <TouchableOpacity
              key={recipe._id}
              style={styles.recipeContainer}
              onPress={() =>
                navigation.navigate("RecipeScreen", {
                  recipe, // Passer toutes les données de la recette à RecipeScreen
                })
              }
            >
              <Text style={styles.recipeTitle}>
                {truncateTitle(recipe.Title)}
              </Text>
              <Image
                source={{
                  uri: `${getHostname()}/images/food/${recipe.ImageName}`,
                }}
                style={styles.recipeImage}
              />
            </TouchableOpacity>
          ))}
      </View>

      <Button title="Retour" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
};

export default Surpoids;
