import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 20,
  },
  responseContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageScrollContainer: {
    marginBottom: 15,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
  noImageIcon: {
    fontSize: 50,
    textAlign: "center",
    color: "#ccc",
  },
  productInfo: {
    marginTop: 10,
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  productDetail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  nutrient: {
    fontSize: 16,
    color: "#444",
    marginTop: 2,
  },
});

export default styles;
