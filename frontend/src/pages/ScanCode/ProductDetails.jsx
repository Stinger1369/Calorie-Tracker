import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import axios from 'axios';
import styles from "./ProductDetailsStyle"; // Assurez-vous que le fichier de style est correctement importé

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

  const renderField = (label, field) => {
    if (typeof field === 'object') {
      return (
        <Text style={styles.productDetail}>
          {label}: {Object.values(field).join(", ")}
        </Text>
      );
    } else {
      return (
        <Text style={styles.productDetail}>
          {label}: {field || "N/A"}
        </Text>
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.responseContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScrollContainer}>
          {product.image_urls && product.image_urls.image_url ? (
            <>
              <Image
                source={{ uri: product.image_urls.image_url }}
                style={styles.image}
                resizeMode="contain"
              />
              {product.image_urls.image_ingredients_url && (
                <Image
                  source={{ uri: product.image_urls.image_ingredients_url }}
                  style={styles.image}
                  resizeMode="contain"
                />
              )}
              {product.image_urls.image_nutrition_url && (
                <Image
                  source={{ uri: product.image_urls.image_nutrition_url }}
                  style={styles.image}
                  resizeMode="contain"
                />
              )}
            </>
          ) : (
            <Text style={styles.noImageIcon}>📦</Text>
          )}
        </ScrollView>

        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.product_name || "N/A"}</Text>
          <Text style={styles.productDetail}>Brands: {product.brands || "N/A"}</Text>
          <Text style={styles.productDetail}>Categories: {product.categories || "N/A"}</Text>
          {renderField("Nutriscore", product.nutriscore)}
          <Text style={styles.productDetail}>Quantity: {product.quantity || "N/A"}</Text>
          <Text style={styles.nutrient}>Energy (kcal): {product.nutriments?.energy_kcal || "N/A"}</Text>
          <Text style={styles.nutrient}>Proteins: {product.nutriments?.proteins || "N/A"}</Text>
          <Text style={styles.nutrient}>Sugars: {product.nutriments?.sugars || "N/A"}</Text>
          <Text style={styles.nutrient}>Saturated Fat: {product.nutriments?.saturated_fat || "N/A"}</Text>
          <Text style={styles.nutrient}>Salt: {product.nutriments?.salt || "N/A"}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductDetails;
