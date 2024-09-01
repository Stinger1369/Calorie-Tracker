import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import axios from 'axios';

const ProductDetails = ({ route }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.1.97:8090/api/products`, {
          params: {
            product_id: productId
          }
        });
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (!product) {
    return <Text>Loading...</Text>;
  }

  // Fonction pour afficher un champ, en gérant les objets et autres types de données
  const renderField = (label, field) => {
    if (typeof field === 'object') {
      return (
        <Text>
          {label}: {Object.values(field).join(", ")}
        </Text>
      );
    } else {
      return (
        <Text>
          {label}: {field || "N/A"}
        </Text>
      );
    }
  };

  return (
    <View>
      <Text>Product Name: {product.product_name || "N/A"}</Text>
      <Text>Brands: {product.brands || "N/A"}</Text>
      <Text>Categories: {product.categories || "N/A"}</Text>
      {renderField("Nutriscore", product.nutriscore)}
      <Text>Quantity: {product.quantity || "N/A"}</Text>
      <Text>Energy (kcal): {product.nutriments?.energy_kcal || "N/A"}</Text>
      <Text>Proteins: {product.nutriments?.proteins || "N/A"}</Text>
      <Text>Sugars: {product.nutriments?.sugars || "N/A"}</Text>
      <Text>Saturated Fat: {product.nutriments?.saturated_fat || "N/A"}</Text>
      <Text>Salt: {product.nutriments?.salt || "N/A"}</Text>
    </View>
  );
};

export default ProductDetails;
