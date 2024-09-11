

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1, // Permet au conteneur principal de prendre toute la hauteur disponible
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  exerciseContainer: {
    flex: 1,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
  },
  exerciseImage: {
    width: 240,
    height: 240,
    borderRadius: 10,
  },
  placeholderImage: {
    width: 240,
    height: 240,
    backgroundColor: "#ccc",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  monthText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  switcherContainer: {
    alignItems: "center",
  },
  monthSwitcher: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  sessionSwitcher: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  monthButton: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: 5,
  },
  sessionButton: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: "#28a745",
    color: "#fff",
    borderRadius: 5,
  },
});

export default styles;
