import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
  greetingContainer: {
    flexDirection: "column",
  },
  welcomeText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  dateText: {
    color: "#AAAAAA",
    fontSize: 14,
  },
  editIconContainer: {
    padding: 5,
    backgroundColor: "#444444",
    borderRadius: 10,
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionDate: {
    color: "#AAAAAA",
    fontSize: 14,
  },
  infoCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: "#29292B",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  infoCardTitle: {
    color: "#AAAAAA",
    fontSize: 14,
    marginTop: 5,
  },
  infoCardValue: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 5,
  },
  actionCard: {
    backgroundColor: "#444444",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  actionSubText: {
    color: "#AAAAAA",
    fontSize: 14,
    textAlign: "center",
  },
  imcContainer: {
    padding: 20,
    backgroundColor: "#29292B",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  imcText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default styles;
