import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  greetingContainer: {
    flexDirection: "column",
  },
  welcomeText: {
    color: "#FFFFFF",
    fontSize: 20, // Adjusted size
    fontWeight: "bold",
    marginLeft: 20,
  },
  dateText: {
    color: "#AAAAAA",
    fontSize: 14,
    marginLeft: 20,
  },
  editIconContainer: {
    padding: 5,
    backgroundColor: "#292929",
    borderRadius: 10,
  },
});

export default styles;
