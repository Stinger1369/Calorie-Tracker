import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import styles from './ScanHistoryStyles';

const ScanHistory = () => {
  const [history, setHistory] = useState([]);
  const navigation = useNavigation();

  // Récupérer l'ID utilisateur depuis Redux
  const userId = useSelector((state) => state.auth?.user?._id);

  useEffect(() => {
    const fetchScanHistory = async () => {
      try {
        if (!userId) {
          console.error("User ID not found in Redux store");
          return;
        }

        const response = await axios.get(`http://192.168.1.97:8090/api/user_scans`, {
          params: {
            user_id: userId
          }
        });

        if (response.data && response.data.scans) {
          setHistory(response.data.scans);
        } else {
          console.error("No scans data found in the response");
        }
      } catch (error) {
        console.error("Error fetching scan history:", error);
      }
    };

    fetchScanHistory();
  }, [userId]);

  const handleProductClick = (productId) => {
    navigation.navigate('ProductDetails', { productId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleProductClick(item.product_id)} style={styles.card}>
      <View style={styles.imageContainer}>
        {item.image_urls && item.image_urls.image_url ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Image source={{ uri: item.image_urls.image_url }} style={styles.image} />
            {item.image_urls.image_ingredients_url && (
              <Image source={{ uri: item.image_urls.image_ingredients_url }} style={styles.image} />
            )}
            {item.image_urls.image_nutrition_url && (
              <Image source={{ uri: item.image_urls.image_nutrition_url }} style={styles.image} />
            )}
          </ScrollView>
        ) : (
          <Text style={styles.noImageIcon}>📦</Text> // Utilisez une icône pour les produits sans image
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.productName}>Product ID: {item.product_id}</Text>
        <Text style={styles.productCode}>Code: {item.code}</Text>
        <Text style={styles.date}>{new Date(item.timestamp).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan History</Text>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.timestamp.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default ScanHistory;
