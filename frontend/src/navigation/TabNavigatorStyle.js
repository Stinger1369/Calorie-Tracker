import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  menuContainer: {
    position: "absolute",
    bottom: 0, // Positionne le menu au bas de l'écran
    width: "100%",
    backgroundColor: "#0E1331", // Assure que le fond s'aligne avec l'arrière-plan global
    paddingVertical: 10, // Ajoute un peu d'espacement vertical
    zIndex: 10,
  },
  circularMenuScrollContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  circularButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1D233F",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  centralButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FBC02D",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FBC02D", // Outer glow effect
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
    marginHorizontal: 20,
  },
});
