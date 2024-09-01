import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  camera: {
    flex: 1,
    height: 400, // Hauteur de la caméra
    marginBottom: 20,
  },
  responseContainer: {
    marginTop: 20,
  },
  responseText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default styles;
