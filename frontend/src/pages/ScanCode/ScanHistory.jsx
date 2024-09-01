import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

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

        console.log("Fetched User ID from Redux:", userId);

        const response = await axios.get(`http://192.168.1.97:8090/api/user_scans`, {
          params: {
            user_id: userId
          }
        });

        console.log("Response Data:", response.data);

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
    <TouchableOpacity onPress={() => handleProductClick(item.product_id)}>
      <View>
        <Text>Product ID: {item.product_id}</Text>
        <Text>Code: {item.code}</Text>
        <Text>Date: {new Date(item.timestamp).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <Text>Scan History</Text>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.timestamp.toString()}
      />
    </View>
  );
};

export default ScanHistory;
