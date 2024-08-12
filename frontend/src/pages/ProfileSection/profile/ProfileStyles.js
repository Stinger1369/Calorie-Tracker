import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E", // Couleur de fond sombre
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  welcomeText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  dateText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  kcalText: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default styles;
