import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  infoCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  leftColumn: {
    flex: 1,
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  rightColumn: {
    flex: 1,
    justifyContent: "center",
    marginRight: 100,
  },
  caloriesCard: {
    backgroundColor: "#FF6347",
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    padding: 15,
    borderRadius: 20,
    width: 120,
    height: 120,
  },
  stepsCard: {
    backgroundColor: "#4682B4",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 20,
    width: 120,
    height: 120,
  },
  bpmCard: {
    backgroundColor: "#1E2132",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 20,
    width: 250,

  },
  heartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
   },
  heartTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  heartRateValue: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  infoCardTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 5,
  },
  infoCardValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
});

export default styles;
