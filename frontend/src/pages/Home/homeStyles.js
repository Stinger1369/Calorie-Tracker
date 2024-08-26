import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    backgroundColor: "#0E1331",
    paddingHorizontal: 20,
    paddingTop: "15%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  profileInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  iconContainer: {
    padding: 10,
  },
  welcomeText: {
    fontSize: width * 0.06, // Responsive text size
    fontWeight: "600",
    color: "#ffffff",
  },
  dateText: {
    fontSize: width * 0.045, // Responsive text size
    fontWeight: "400",
    color: "#ffffff",
  },
  sectionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  section: {
    width: width * 0.4, // Slightly reduced width for each section
    padding: width * 0.04, // Slightly reduced padding
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  sectionText: {
    marginTop: 10,
    fontSize: width * 0.038, // Slightly reduced font size for text
    color: "#ffffff",
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
    padding: 20,
    alignItems: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#e74c3c",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
