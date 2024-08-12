import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E", // Couleur de fond sombre
    padding: 20,
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileIcon: {
    backgroundColor: "#2C2C2E",
    borderRadius: 50,
    padding: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  label: {
    color: "#FFFFFF", // Texte blanc
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#2C2C2E",
    color: "#FFFFFF",
    fontSize: 16,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row", // Organise les enfants en ligne
    justifyContent: "space-between", // Sépare les boutons également
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#FF4D4D",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginRight: 10, // Ajoute un espace entre les boutons
  },
  nextButton: {
    backgroundColor: "#FF9500",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;
