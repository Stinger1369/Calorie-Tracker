package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// HandleWebSocketConnection manages WebSocket connections and responds with product data
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

		log.Printf("Searching for product with code (used as _id): %s\n", request.Code)

		product, err := GetProductByCode(client, request.Code)
		if err != nil {
			response := map[string]string{"message": err.Error()}
			conn.WriteJSON(response)
			continue
		}

		response := map[string]interface{}{
			"product_name": product["product_name"],
			"brands":       product["brands"],
			"categories":   product["categories"],
			"nutriments":   FilterNutriments(product),
			"ingredients":  FilterIngredients(product),
			"nutriscore":   GetNutriscoreGrade(product),
			"image_urls":   GetImageURLs(product),
			"is_healthy":   IsHealthy(FilterNutriments(product), GetNutriscoreGrade(product)),
		}

		log.Printf("Sending response: %v\n", response)

		SaveUserScanHistory(client, request.UserID, request.Code, product["_id"].(primitive.ObjectID).Hex())

		if err := conn.WriteJSON(response); err != nil {
			log.Println("Error writing WebSocket message:", err)
			break
		}
	}
}
