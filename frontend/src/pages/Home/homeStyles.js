import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// Fonction pour calculer dynamiquement la taille des éléments
const getResponsiveSize = (percentage, base = "width") => {
  return Math.round((percentage * (base === "height" ? height : width)) / 100);
};

export default StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    // marginBottom: getResponsiveSize(5, "height"),
  },
  container: {
    flex: 1,
    backgroundColor: "#0E1331",
    paddingHorizontal: getResponsiveSize(5),
    paddingTop: getResponsiveSize(10, "height"),
  },
  menuContainer: {
    // position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#0E1331",
    paddingVertical: getResponsiveSize(2, "height"),
    zIndex: 10,
  },
  circularMenuScrollContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: getResponsiveSize(5),
  },
  circularButton: {
    width: getResponsiveSize(15),
    height: getResponsiveSize(15),
    borderRadius: getResponsiveSize(7.5),
    backgroundColor: "#1D233F",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: getResponsiveSize(2),
  },
  centralButton: {
    width: getResponsiveSize(20),
    height: getResponsiveSize(20),
    borderRadius: getResponsiveSize(10),
    backgroundColor: "#FBC02D",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FBC02D",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
    marginHorizontal: getResponsiveSize(5),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: getResponsiveSize(5, "height"),
  },
  profileInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: getResponsiveSize(12),
    height: getResponsiveSize(12),
    borderRadius: getResponsiveSize(50),
    marginRight: getResponsiveSize(5),
  },
  iconContainer: {
    padding: getResponsiveSize(3),
  },
  welcomeText: {
    fontSize: getResponsiveSize(5),
    fontWeight: "600",
    color: "#ffffff",
  },
  dateText: {
    fontSize: getResponsiveSize(4),
    fontWeight: "400",
    color: "#ffffff",
  },
  sectionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: getResponsiveSize(5, "height"),
    paddingBottom: getResponsiveSize(5, "height"),
  },
  section: {
    width: "47%",
    paddingVertical: getResponsiveSize(2, "height"),
    borderRadius: 10,
    alignItems: "center",
    marginBottom: getResponsiveSize(2, "height"),
  },
  sectionText: {
    marginTop: getResponsiveSize(2, "height"),
    fontSize: getResponsiveSize(3.5),
    color: "#ffffff",
    textAlign: "center",
  },
  sectionChat: {
    backgroundColor: "#3498db",
  },
  sectionDating: {
    backgroundColor: "#e74c3c",
  },
  sectionNutrition: {
    backgroundColor: "#27ae60",
  },
  sectionExercise: {
    backgroundColor: "#f1c40f",
  },
  sectionHoroscope: {
    backgroundColor: "#9b59b6",
  },
  sectionGroupActivities: {
    backgroundColor: "#1abc9c",
  },
  sectionCaloriesNeeded: {
    backgroundColor: "#e67e22",
  },
  sectionCalorieCalculator: {
    backgroundColor: "#34495e",
  },
  sectionMembers: {
    backgroundColor: "#d35400",
  },
  sectionRecipes: {
    backgroundColor: "#8e44ad",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: getResponsiveSize(10, "height"),
    paddingHorizontal: getResponsiveSize(5),
    alignItems: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: getResponsiveSize(2, "height"),
    right: getResponsiveSize(2),
    zIndex: 1,
  },
  modalText: {
    fontSize: getResponsiveSize(4),
    fontWeight: "bold",
    color: "#333",
    marginBottom: getResponsiveSize(5, "height"),
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    paddingVertical: getResponsiveSize(2, "height"),
    paddingHorizontal: getResponsiveSize(5),
    backgroundColor: "#e74c3c",
    borderRadius: 5,
    marginHorizontal: getResponsiveSize(3),
  },
  modalButtonText: {
    color: "#fff",
    fontSize: getResponsiveSize(4),
    fontWeight: "bold",
  },
  // Ajout des styles pour les icônes
  icon: {
    fontSize: getResponsiveSize(10), // équivalent à size={40}
    color: "#ffffff",
  },
  iconLogout: {
    fontSize: getResponsiveSize(7.5), // équivalent à size={30}
    color: "#ffffff",
  },
  iconClose: {
    fontSize: getResponsiveSize(7.5), // équivalent à size={30}
    color: "#e74c3c",
  },
});
