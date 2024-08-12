import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    paddingHorizontal: 20,
    paddingTop: "20%", // Ajuste le padding en fonction du header
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: 30,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#2C2C2E",
    color: "#FFFFFF",
    fontSize: 16,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  picker: {
    backgroundColor: "#2C2C2E",
    color: "#FFFFFF",
    marginBottom: 15,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#FF4D4D",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  nextButton: {
    backgroundColor: "#FF9500",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#2C2C2E",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default styles;

