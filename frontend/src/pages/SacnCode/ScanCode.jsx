import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Assurez-vous d'avoir installé ce package
import styles from "./ScanCodeStyles";

const ScanCode = () => {
  const [code, setCode] = useState("");
  const [response, setResponse] = useState(null);
  const ws = useRef(null);
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [userId, setUserId] = useState(null); // Stocker l'ID utilisateur

  // Récupérer l'ID utilisateur depuis Redux
  const reduxUserId = useSelector((state) => state.auth?.user?._id);

  useEffect(() => {
    const fetchUserId = async () => {
      if (reduxUserId) {
        setUserId(reduxUserId);
        console.log("User ID fetched from Redux:", reduxUserId);
      } else {
        try {
          const storedUserId = await AsyncStorage.getItem('user_id');
          if (storedUserId) {
            setUserId(storedUserId);
            console.log("User ID fetched from AsyncStorage:", storedUserId);
          } else {
            console.error("No user ID found in AsyncStorage");
          }
        } catch (error) {
          console.error("Error fetching user ID from AsyncStorage:", error);
        }
      }
    };

    fetchUserId();
  }, [reduxUserId]);

  useEffect(() => {
    const connectWebSocket = () => {
      if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
        console.log("Initializing WebSocket connection...");
        ws.current = new WebSocket("ws://192.168.1.97:8090/ws/products");

        ws.current.onopen = () => {
          console.log("Connected to WebSocket server");
          setIsWsConnected(true);
        };

        ws.current.onmessage = (event) => {
          console.log("Received message from WebSocket:", event.data);
          try {
            const parsedData = JSON.parse(event.data);
            setResponse(parsedData);
            console.log("Parsed response:", parsedData);
          } catch (err) {
            console.error("Error parsing WebSocket message:", err);
          }
        };

        ws.current.onerror = (error) => {
          console.error("WebSocket error:", error);
          setTimeout(connectWebSocket, 5000); // Tentative de reconnexion après 5 secondes
        };

        ws.current.onclose = (event) => {
          console.log("WebSocket connection closed", event.reason);
          setIsWsConnected(false);
          setTimeout(connectWebSocket, 5000); // Tentative de reconnexion après 5 secondes
        };
      } else {
        console.log("WebSocket is already connected or connecting");
      }
    };

    connectWebSocket();

    return () => {
      console.log("Cleaning up: Closing WebSocket connection");
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [userId]);

  const handleSendCode = () => {
    console.log("Attempting to send code:", code);
    if (
      userId &&
      isWsConnected &&
      ws.current &&
      ws.current.readyState === WebSocket.OPEN
    ) {
      const message = JSON.stringify({ code, user_id: userId, lang: "fr" });
      console.log("Sending message:", message);
      ws.current.send(message);
    } else {
      console.error("WebSocket is not open or user ID is not available.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter a Product Code</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter barcode"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
      />

      <Button title="Send Code" onPress={handleSendCode} />

      {response && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseText}>Product Information:</Text>
          {response.product_name ? (
            <Text>Product Name: {response.product_name}</Text>
          ) : (
            <Text>Product Name: N/A</Text>
          )}
          {response.brands && <Text>Brands: {response.brands}</Text>}
          {response.categories && (
            <Text>Categories: {response.categories}</Text>
          )}
          {response.nutriscore && (
            <Text>Nutriscore: {response.nutriscore}</Text>
          )}
          {response.quantity && <Text>Quantity: {response.quantity}</Text>}
          {response.nutriments && (
            <>
              {response.nutriments.energy_kcal && (
                <Text> - Energy (kcal): {response.nutriments.energy_kcal}</Text>
              )}
              {response.nutriments.proteins && (
                <Text> - Proteins: {response.nutriments.proteins}</Text>
              )}
              {response.nutriments.sugars && (
                <Text> - Sugars: {response.nutriments.sugars}</Text>
              )}
              {response.nutriments.saturated_fat && (
                <Text>
                  {" "}
                  - Saturated Fat: {response.nutriments.saturated_fat}
                </Text>
              )}
              {response.nutriments.salt && (
                <Text> - Salt: {response.nutriments.salt}</Text>
              )}
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default ScanCode;
