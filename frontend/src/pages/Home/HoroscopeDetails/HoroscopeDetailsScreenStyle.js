import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e", // Un fond sombre pour évoquer la nuit.
  },
  starsContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  starContainer: {
    position: "absolute",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff", // Texte en blanc pour contraster avec le fond sombre.
    marginBottom: 20,
  },
  horoscopeText: {
    fontSize: 18,
    textAlign: "center",
    color: "#dcdcdc",
  },
});
