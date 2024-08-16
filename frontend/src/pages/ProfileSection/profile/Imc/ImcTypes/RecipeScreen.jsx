import React from "react";
import { View, Text, ScrollView, Image, Button } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "./RecipeScreenStyle";
import { getHostname } from "../../../../../hostname";

const RecipeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { recipe } = route.params; // Récupérer les données de la recette passées depuis l'écran précédent

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{recipe.Title}</Text>
      <Image
        source={{
          uri: `${getHostname()}/images/food/${recipe.ImageName}`,
        }}
        style={styles.recipeImage}
      />
      <Text style={styles.sectionTitle}>Ingrédients:</Text>
      <Text style={styles.text}>{recipe.Ingredients}</Text>

      <Text style={styles.sectionTitle}>Instructions:</Text>
      <Text style={styles.text}>{recipe.Instructions}</Text>

      <Text style={styles.sectionTitle}>Calories:</Text>
      <Text style={styles.text}>{recipe.EstimatedCalories} kcal</Text>

      <Text style={styles.sectionTitle}>Saison:</Text>
      <Text style={styles.text}>{recipe.Season}</Text>

      <Button title="Retour" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
};

export default RecipeScreen;
