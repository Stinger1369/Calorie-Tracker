import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Button,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient"; // Assurez-vous d'avoir installé ce module
import styles from "./RecipeScreenStyle";
import { getHostname } from "../../../../../hostname";

const RecipeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { recipe } = route.params;

  const [language, setLanguage] = useState("fr");
  const [translatedRecipe, setTranslatedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const translateRecipe = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://192.168.1.97:8001/translate_recipe?language=${language}`,
        {
          Title: recipe.Title,
          Ingredients: recipe.Ingredients,
          Instructions: recipe.Instructions,
        }
      );
      setTranslatedRecipe(response.data.translated_recipe);
    } catch (error) {
      Alert.alert("Erreur", "La traduction a échoué.");
      console.error("Erreur lors de la traduction :", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (language) => {
    switch (language) {
      case "fr":
        return "FR";
      case "ar":
        return "AR";
      case "es":
        return "ES";
      default:
        return "";
    }
  };

  return (
    <View style={styles.container}>
      {/* Barre de langue en haut à droite */}
      <View style={styles.languageContainer}>
        {/* Sphère avec les initiales et les couleurs du drapeau français */}
        <LinearGradient
          colors={["#0055A4", "#ffffff", "#EF4135"]} // Couleurs du drapeau français (bleu, blanc, rouge)
          style={styles.sphere}
        >
          <Text style={styles.sphereText}>{getInitials(language)}</Text>
        </LinearGradient>

        <Picker
          selectedValue={language}
          style={styles.languagePicker}
          onValueChange={(itemValue) => setLanguage(itemValue)}
        >
          <Picker.Item label="Français" value="fr" />
          <Picker.Item label="Arabe" value="ar" />
          <Picker.Item label="Espagnol" value="es" />
        </Picker>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
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

        <Button title="Traduire la recette" onPress={translateRecipe} />

        {loading && <ActivityIndicator size="large" />}
        {translatedRecipe && (
          <View>
            <Text style={styles.translatedTitle}>Recette traduite :</Text>
            <Text style={styles.text}>{translatedRecipe}</Text>
          </View>
        )}

        <Button title="Retour" onPress={() => navigation.goBack()} />
      </ScrollView>
    </View>
  );
};

export default RecipeScreen;
