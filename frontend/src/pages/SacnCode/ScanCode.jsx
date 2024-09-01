import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useSelector } from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "./ScanCodeStyles";

const ScanCode = () => {
  const [code, setCode] = useState("");
  const [response, setResponse] = useState(null);
  const ws = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const [isWsConnected, setIsWsConnected] = useState(false);
  const [userId, setUserId] = useState(null); 

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
          setTimeout(connectWebSocket, 5000); 
        };

        ws.current.onclose = (event) => {
          console.log("WebSocket connection closed", event.reason);
          setIsWsConnected(false);
          setTimeout(connectWebSocket, 5000);
        };
      } else {
        console.log("WebSocket is already connected or connecting");
      }
    };

    connectWebSocket();

    const requestPermissions = async () => {
      try {
        console.log("Requesting camera permission...");
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === "granted");
        console.log("Camera permission status:", status);
      } catch (error) {
        console.error("Error requesting camera permission:", error);
      }
    };

    requestPermissions();

    return () => {
      console.log("Cleaning up: Closing WebSocket connection");
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [userId]);

  const handleSendCode = (scannedCode) => {
    console.log("Attempting to send code:", scannedCode);
    if (
      userId &&
      isWsConnected &&
      ws.current &&
      ws.current.readyState === WebSocket.OPEN
    ) {
      const message = JSON.stringify({ code: scannedCode, user_id: userId, lang: "fr" });
      console.log("Sending message:", message);
      ws.current.send(message);
    } else {
      console.error("WebSocket is not open or user ID is not available.");
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setIsScanning(false);
    console.log(`Barcode scanned: ${data}, type: ${type}`);
    setCode(data);
    handleSendCode(data);
  };

  if (hasPermission === null) {
    console.log("Waiting for camera permission...");
    return <Text>Requesting camera permission</Text>;
  }
  if (hasPermission === false) {
    console.log("Camera permission denied");
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan a Product Code</Text>

      {isScanning && (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={styles.camera}
        />
      )}

      {!isScanning && (
        <TouchableOpacity onPress={() => setIsScanning(true)}>
          <Text>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}

      {response && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseText}>Product Information:</Text>
          <Text>Product Name: {response.product_name || "N/A"}</Text>
          <Text>Brands: {response.brands || "N/A"}</Text>
          <Text>Categories: {response.categories || "N/A"}</Text>
          <Text>Nutriscore: {response.nutriscore || "N/A"}</Text>
          <Text>Quantity: {response.quantity || "N/A"}</Text>
          {response.nutriments && (
            <>
              <Text> - Energy (kcal): {response.nutriments.energy_kcal || "N/A"}</Text>
              <Text> - Proteins: {response.nutriments.proteins || "N/A"}</Text>
              <Text> - Sugars: {response.nutriments.sugars || "N/A"}</Text>
              <Text> - Saturated Fat: {response.nutriments.saturated_fat || "N/A"}</Text>
              <Text> - Salt: {response.nutriments.salt || "N/A"}</Text>
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default ScanCode;
