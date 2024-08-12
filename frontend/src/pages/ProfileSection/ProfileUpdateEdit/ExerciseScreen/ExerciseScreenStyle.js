import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E", // Couleur de fond sombre
    padding: 20,
    paddingTop: "20%",
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: "30%",
  },
  label: {
    color: "#FFFFFF",
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#FF4D4D",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  finishButton: {
    backgroundColor: "#4CAF50", // Couleur de fond pour le bouton Finish
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
  finishButtonText: {
    color: "#FFFFFF", // Couleur du texte du bouton Finish
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;
