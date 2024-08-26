import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
  },
  picker: {
    height: 50,
    width: 150,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  recipeContainer: {
    width: "48%",
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 8,
  },
  recipeImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
});
