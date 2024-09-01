package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// Structure pour l'historique des scans
type ScanHistory struct {
	UserID    string    `json:"user_id" bson:"user_id"`
	Code      string    `json:"code" bson:"code"`
	ProductID string    `json:"product_id" bson:"product_id"`
	Timestamp time.Time `json:"timestamp" bson:"timestamp"`
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // À restreindre en production
	},
}

// HandleWebSocketConnection gère les connexions WebSocket
func HandleWebSocketConnection(client *mongo.Client, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error upgrading to WebSocket:", err)
		return
	}
	defer conn.Close()

	for {
		_, message, err := conn.ReadMessage()
		if websocket.IsCloseError(err, websocket.CloseNormalClosure) {
			log.Println("WebSocket connection closed normally")
			break
		}
		if err != nil {
			log.Println("Error reading WebSocket message:", err)
			break
		}

		var request struct {
			Code   string `json:"code"`
			Lang   string `json:"lang"`
			UserID string `json:"user_id"`
		}
		if err := json.Unmarshal(message, &request); err != nil {
			log.Println("Invalid JSON:", err)
			continue
		}

		if request.Lang != "fr" && request.Lang != "en" && request.Lang != "es" {
			request.Lang = "fr"
		}

		collection := client.Database("openfoodfacts").Collection("products")
		filter := bson.M{"code": request.Code}
		var product map[string]interface{}
		err = collection.FindOne(context.TODO(), filter).Decode(&product)
		if err != nil {
			response := map[string]string{"message": "Product not found"}
			conn.WriteJSON(response)
			continue
		}

		productID := product["_id"].(string)

		nutriments, ok := product["nutriments"].(map[string]interface{})
		if !ok {
			nutriments = map[string]interface{}{}
		}

		response := map[string]interface{}{
			"product_name": product["product_name"],
			"brands":       product["brands"],
			"categories":   product["categories"],
			"nutriscore":   product["nutriscore_grade"],
			"quantity":     product["quantity"],
			"image_url":    product["image_url"],
			"nutriments": map[string]interface{}{
				"energy_kcal":   nutriments["energy-kcal_value"],
				"proteins":      nutriments["proteins_value"],
				"sugars":        nutriments["sugars_value"],
				"saturated_fat": nutriments["saturated-fat_value"],
				"salt":          nutriments["salt_value"],
			},
		}

		saveUserScanHistory(client, request.UserID, request.Code, productID)

		if err := conn.WriteJSON(response); err != nil {
			log.Println("Error writing WebSocket message:", err)
			break
		}
	}
}
