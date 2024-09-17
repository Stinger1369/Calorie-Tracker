import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
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
          // Utilisation de useEffect pour gérer le setTimeout
          const timeout = setTimeout(connectWebSocket, 5000);
          return () => clearTimeout(timeout);
        };

        ws.current.onclose = (event) => {
          setIsWsConnected(false);
          // Utilisation de useEffect pour gérer le setTimeout
          const timeout = setTimeout(connectWebSocket, 5000);
          return () => clearTimeout(timeout);
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
      const message = JSON.stringify({ code: scannedCode, user_id: userId });
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
          <Text style={styles.scanButtonText}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}

      {response && (
        <ScrollView style={styles.scrollViewContainer}>
          <View style={styles.responseContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScrollContainer}>
              {response.image_urls && response.image_urls.image_url ? (
                <>
                  <Image
                    source={{ uri: response.image_urls.image_url }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                  {response.image_urls.image_ingredients_url && (
                    <Image
                      source={{ uri: response.image_urls.image_ingredients_url }}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  )}
                  {response.image_urls.image_nutrition_url && (
                    <Image
                      source={{ uri: response.image_urls.image_nutrition_url }}
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
              <Text style={styles.productName}>{response.product_name || "N/A"}</Text>
              <Text style={styles.productDetail}>Brands: {response.brands || "N/A"}</Text>
              <Text style={styles.productDetail}>Categories: {response.categories || "N/A"}</Text>
              <Text style={styles.productDetail}>Nutriscore: {response.nutriscore || "N/A"}</Text>
              <Text style={styles.productDetail}>Quantity: {response.quantity || "N/A"}</Text>

              <Text style={[styles.productDetail, { color: response.is_healthy ? 'green' : 'red' }]}>
                Health Status: {response.is_healthy ? 'Healthy' : 'Unhealthy'}
              </Text>

              {response.nutriments && Object.keys(response.nutriments).map((key) => {
                const value = response.nutriments[key];
                if (value !== null) {
                  return <Text style={styles.nutrient} key={key}>{key.replace('_', ' ').replace('-', ' ')}: {value}</Text>;
                }
                return null;
              })}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default ScanCode;
