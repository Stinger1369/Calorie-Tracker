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
import { getHostname } from "../../../hostname";
import styles from "./RecipesScreenStyles";

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
  const [season, setSeason] = useState("forallseason");

  const handleMinCaloriesChange = (value) => {
    setMinCalories(value);
    if (value >= maxCalories - 100) {
      setMaxCalories(Math.min(value + 100, 5000));
    }
  };

  const handleMaxCaloriesChange = (value) => {
    // Bloque le max si l'utilisateur essaie de le rendre inférieur au min + 100
    if (value >= minCalories + 100) {
      setMaxCalories(value);
    }
  };

  const handleApplyFilters = () => {
    dispatch(
      fetchRecommendationsByCaloriesRange({
        minCalories,
        maxCalories,
        season,
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
          maximumValue={4900} // Limite pour le slider de minCalories
          step={50}
          value={minCalories}
          onValueChange={handleMinCaloriesChange}
        />
        <Text style={styles.sliderLabel}>Max Calories</Text>
        <Slider
          style={styles.slider}
          minimumValue={minCalories + 100} // Limite pour empêcher le max d'être inférieur au min
          maximumValue={5000}
          step={50}
          value={maxCalories}
          onValueChange={handleMaxCaloriesChange}
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
                  recipe,
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
