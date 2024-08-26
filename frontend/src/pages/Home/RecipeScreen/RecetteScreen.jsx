import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendationsByCaloriesRange } from "../../../redux/features/recommendation/recommendationSlice";
import { useNavigation } from "@react-navigation/native";
import { getHostname } from "../../../hostname"; // Pour récupérer l'URL de base du serveur
import styles from "./RecipesScreenStyles"; // Assurez-vous d'ajouter un fichier de styles pour cette page

const truncateTitle = (title) => {
  const words = title.split(" ");
  if (words.length > 2) {
    return `${words.slice(0, 2).join(" ")}...`;
  }
  return title;
};

const RecipesScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {
    data: recommendations,
    loading,
    error,
  } = useSelector((state) => state.recommendations);

  const [minCalories, setMinCalories] = useState(500); // Valeur par défaut minimale
  const [maxCalories, setMaxCalories] = useState(2000); // Valeur par défaut maximale
  const [season, setSeason] = useState("forallseason"); // Valeur par défaut pour la saison

  const handleApplyFilters = () => {
    // Validation pour s'assurer que maxCalories est supérieur à minCalories
    if (maxCalories <= minCalories) {
      alert(
        "Le maximum des calories doit être supérieur au minimum des calories."
      );
      return;
    }

    // Appliquer les filtres lorsque le bouton de validation est pressé
    dispatch(
      fetchRecommendationsByCaloriesRange({
        minCalories,
        maxCalories,
        season, // Ajouter la saison à la requête
      })
    );
  };

  useEffect(() => {
    if (!loading) {
      console.log("Recommandations récupérées:", recommendations);
    }
  }, [loading, recommendations]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Recettes Recommandées</Text>

      {loading && <ActivityIndicator size="large" />}
      {error && (
        <View style={{ marginVertical: 20 }}>
          <Text style={{ color: "red" }}>Erreur: {error}</Text>
        </View>
      )}

      {/* Filtre par saison */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Saison:</Text>
        <Picker
          selectedValue={season}
          style={styles.picker}
          onValueChange={(itemValue) => setSeason(itemValue)}
        >
          <Picker.Item label="Toutes les saisons" value="forallseason" />
          <Picker.Item label="Printemps" value="spring" />
          <Picker.Item label="Été" value="summer" />
          <Picker.Item label="Automne" value="fall" />
          <Picker.Item label="Hiver" value="winter" />
        </Picker>
      </View>

      {/* Filtre par plage de calories */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>
          Calories: {minCalories} - {maxCalories}
        </Text>
        <Text style={styles.sliderLabel}>Min Calories</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={5000} // Fixez la plage maximale de calories
          step={50}
          value={minCalories}
          onValueChange={(value) => setMinCalories(value)}
        />
        <Text style={styles.sliderLabel}>Max Calories</Text>
        <Slider
          style={styles.slider}
          minimumValue={0} // Fixez la plage minimale de calories
          maximumValue={5000} // Fixez la plage maximale de calories
          step={50}
          value={maxCalories}
          onValueChange={(value) => setMaxCalories(value)}
        />
      </View>

      {/* Bouton de validation pour appliquer les filtres */}
      <View style={styles.applyButtonContainer}>
        <Button title="Appliquer les filtres" onPress={handleApplyFilters} />
      </View>

      <View style={styles.gridContainer}>
        {!loading && recommendations.length > 0 ? (
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
                onError={(error) =>
                  console.log("Erreur de chargement de l'image:", error)
                }
              />
            </TouchableOpacity>
          ))
        ) : (
          <Text>Aucune recette trouvée</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default RecipesScreen;
