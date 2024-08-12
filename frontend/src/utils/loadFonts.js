import * as Font from "expo-font";

export const loadFonts = async () => {
  await Font.loadAsync({
    "Avenir-Heavy": require("../assets/fonts/Avenir-Heavy.ttf"),
    "Avenir-Medium": require("../assets/fonts/Avenir-Medium.ttf"),
    // Ajoutez d'autres polices ici si nécessaire
  });
};
