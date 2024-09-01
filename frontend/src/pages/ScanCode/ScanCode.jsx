import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useSelector } from "react-redux";
import styles from "./ScanCodeStyles";

const ScanCode = () => {
  const [code, setCode] = useState("");
  const [response, setResponse] = useState(null);
  const ws = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isWsConnected, setIsWsConnected] = useState(false);

  // Récupérer l'ID utilisateur depuis Redux
  const userId = useSelector((state) => state.auth?.user?._id);

  useEffect(() => {
    const connectWebSocket = () => {
      if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
        ws.current = new WebSocket("ws://192.168.1.97:8090/ws/products");

        ws.current.onopen = () => {
          setIsWsConnected(true);
        };

        ws.current.onmessage = (event) => {
          try {
            const parsedData = JSON.parse(event.data);
            setResponse(parsedData);
          } catch (err) {
            console.error("Error parsing WebSocket message:", err);
          }
        };

        ws.current.onerror = (error) => {
          setTimeout(connectWebSocket, 5000);
        };

        ws.current.onclose = (event) => {
          setIsWsConnected(false);
          setTimeout(connectWebSocket, 5000);
        };
      }
    };

    connectWebSocket();

    const requestPermissions = async () => {
      try {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === "granted");
      } catch (error) {
        console.error("Error requesting camera permission:", error);
      }
    };

    requestPermissions();

    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [userId]);

  const handleSendCode = (scannedCode) => {
    if (
      userId &&
      isWsConnected &&
      ws.current &&
      ws.current.readyState === WebSocket.OPEN
    ) {
      const message = JSON.stringify({ code: scannedCode, user_id: userId, lang: "fr" });
      ws.current.send(message);
    } else {
      console.error("WebSocket is not connected or User ID is missing.");
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setIsScanning(false);
    setCode(data);
    handleSendCode(data);
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission</Text>;
  }
  if (hasPermission === false) {
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
