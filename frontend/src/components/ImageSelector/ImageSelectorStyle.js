import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileIcon: {
    marginBottom: 20,
  },
  profileImage: {
    width: 100, // Ajustez la largeur selon vos besoins
    height: 100, // Ajustez la hauteur selon vos besoins
    borderRadius: 50, // Pour une image ronde
    resizeMode: "cover", // Pour ajuster l'image à l'intérieur du cadre
  },
  imageHint: {
    fontSize: 16,
    color: "#888",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  resetButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f44336",
    borderRadius: 5,
  },
  resetButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default styles;
