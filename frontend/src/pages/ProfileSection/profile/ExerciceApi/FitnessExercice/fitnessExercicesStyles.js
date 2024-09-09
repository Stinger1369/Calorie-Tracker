import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  muscleGroupContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  muscleGroupItem: {
    width: "48%",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
  },
  muscleGroupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  exerciseImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;
