import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E1331",
    paddingHorizontal: width * 0.05, // 5% de la largeur de l'écran
    paddingTop: height * 0.05, // 5% de la hauteur de l'écran
  },
  errorText: {
    color: "red",
    fontSize: width * 0.04, // 4% de la largeur de l'écran
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: height * 0.02, // 2% de la hauteur de l'écran
    paddingHorizontal: width * 0.04, // 4% de la largeur de l'écran
    borderRadius: 8, // Utilisation de valeurs fixes pour conserver un design cohérent
    alignItems: "center",
    marginTop: height * 0.03, // 3% de la hauteur de l'écran
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.04, // 4% de la largeur de l'écran
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: width * 0.05, // 5% de la largeur de l'écran
    borderRadius: width * 0.03, // 3% de la largeur de l'écran
    width: "80%", // 80% de la largeur de l'écran
    alignItems: "center",
  },
  modalText: {
    fontSize: width * 0.045, // 4.5% de la largeur de l'écran
    color: "#333",
    textAlign: "center",
    marginBottom: height * 0.02, // 2% de la hauteur de l'écran
  },
  modalButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: height * 0.015, // 1.5% de la hauteur de l'écran
    borderRadius: width * 0.03, // 3% de la largeur de l'écran
    alignItems: "center",
    width: "100%", // 100% de la largeur du modal
  },
  modalButtonText: {
    color: "#fff",
    fontSize: width * 0.045, // 4.5% de la largeur de l'écran
    fontWeight: "bold",
  },
  closeIcon: {
    position: "absolute",
    top: height * 0.015, // 1.5% de la hauteur de l'écran
    right: width * 0.05, // 5% de la largeur de l'écran
  },
});

export default styles;
