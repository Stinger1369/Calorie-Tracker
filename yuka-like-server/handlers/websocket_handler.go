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
	"go.mongodb.org/mongo-driver/mongo/options"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// ProductScan structure to store scan information
type ProductScan struct {
	ProductID string    `json:"product_id" bson:"product_id"`
	Code      string    `json:"code" bson:"code"`
	Timestamp time.Time `json:"timestamp" bson:"timestamp"`
}

// saveUserScanHistory function to save or update user scan history
func saveUserScanHistory(client *mongo.Client, userID, code, productID string) {
	scanCollection := client.Database("openfoodfacts").Collection("user_scans")

	// Check if the user already has a scan history for the product
	filter := bson.M{"user_id": userID, "scans.product_id": productID}

	// Update only the timestamp if the product has already been scanned
	update := bson.M{
		"$set": bson.M{
			"scans.$.timestamp": time.Now(),
		},
	}

	// Try to update the document
	result, err := scanCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		log.Println("Error updating scan history:", err)
		return
	}

	if result.MatchedCount == 0 { // If the product is not already in the scans
		// Add a new product to the list of scans
		filter = bson.M{"user_id": userID} // Search only by user_id
		update = bson.M{
			"$push": bson.M{
				"scans": ProductScan{
					ProductID: productID,
					Code:      code,
					Timestamp: time.Now(),
				},
			},
		}

		// Create the document if it doesn't already exist
		_, err = scanCollection.UpdateOne(context.TODO(), filter, update, options.Update().SetUpsert(true))
		if err != nil {
			log.Println("Error saving scan history:", err)
		}
	}
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

		collection := client.Database("openfoodfacts").Collection("products")

		// Since _id is also the code, we use it directly as an ObjectID
		objectID, err := primitive.ObjectIDFromHex(request.Code)
		if err != nil {
			log.Println("Invalid code format:", err)
			response := map[string]string{"message": "Invalid product code"}
			conn.WriteJSON(response)
			continue
		}

		filter := bson.M{"_id": objectID}

		var product map[string]interface{}
		err = collection.FindOne(context.TODO(), filter).Decode(&product)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				log.Printf("No product found with code: %s\n", request.Code)
				response := map[string]string{"message": "Product not found"}
				conn.WriteJSON(response)
			} else {
				log.Println("Error fetching product:", err)
				response := map[string]string{"message": "Internal Server Error"}
				conn.WriteJSON(response)
			}
			continue
		}

		log.Printf("Product found: %v\n", product)

		productID := product["_id"].(primitive.ObjectID).Hex()

		// Filtering out nutriments directly from the product fields
		nutrientFields := []string{
			"energy-kcal_100g", "energy_100g", "fat_100g", "saturated-fat_100g", "carbohydrates_100g",
			"sugars_100g", "proteins_100g", "salt_100g", "sodium_100g", "bicarbonate_100g", "potassium_100g",
			"chloride_100g", "calcium_100g", "magnesium_100g", "ph_100g",
			"butyric-acid_100g", "capric-acid_100g", "arachidic-acid_100g", "behenic-acid_100g",
			"alpha-linolenic-acid_100g", "arachidonic-acid_100g", "polyols_100g", "fiber_100g",
			"vitamin-a_100g", "vitamin-d_100g", "vitamin-e_100g", "vitamin-c_100g", "vitamin-b1_100g",
			"vitamin-b2_100g", "vitamin-pp_100g", "vitamin-b6_100g", "vitamin-b9_100g", "vitamin-b12_100g",
			"biotin_100g", "pantothenic-acid_100g", "iron_100g", "zinc_100g", "copper_100g",
			"manganese_100g", "selenium_100g", "iodine_100g", "caffeine_100g",
			"fruits-vegetables-nuts-estimate-from-ingredients_100g", "nutrition-score-fr_100g",
		}

		filteredNutriments := make(map[string]interface{})
		for _, field := range nutrientFields {
			if value, ok := product[field]; ok && value != nil {
				switch v := value.(type) {
				case float64:
					if v > 0 {
						filteredNutriments[field] = v
					}
				case int:
					if v > 0 {
						filteredNutriments[field] = v
					}
				}
			}
		}

		// Filtering ingredients with non-zero values
		filteredIngredients := []map[string]interface{}{}
		if ingredients, ok := product["ingredients"].([]interface{}); ok {
			for _, ingredient := range ingredients {
				ingMap := ingredient.(map[string]interface{})
				if percent, ok := ingMap["percent_estimate"].(float64); ok && percent > 0 {
					filteredIngredients = append(filteredIngredients, ingMap)
				}
			}
		}

		// Determine if the product is healthy
		nutriscore := ""
		if ns, ok := product["nutriscore_grade"].(string); ok {
			nutriscore = ns
		}

		isHealthy := isHealthy(filteredNutriments, nutriscore)

		// Extract image URLs from the product document
		imageFields := []string{
			"image_url",
			"image_small_url",
			"image_ingredients_url",
			"image_ingredients_small_url",
			"image_nutrition_url",
			"image_nutrition_small_url",
		}

		images := make(map[string]string)
		for _, field := range imageFields {
			if url, ok := product[field].(string); ok && url != "" {
				images[field] = url
			}
		}

		response := map[string]interface{}{
			"product_name": product["product_name"],
			"brands":       product["brands"],
			"categories":   product["categories"],
			"nutriscore":   nutriscore,
			"quantity":     product["quantity"],
			"image_urls":   images,
			"nutriments":   filteredNutriments,
			"ingredients":  filteredIngredients,
			"is_healthy":   isHealthy,
		}

		log.Printf("Sending response: %v\n", response)

		saveUserScanHistory(client, request.UserID, request.Code, productID)

		if err := conn.WriteJSON(response); err != nil {
			log.Println("Error writing WebSocket message:", err)
			break
		}
	}
}


// isHealthy function determines if a product is healthy based on its nutriments and Nutri-Score
func isHealthy(nutriments map[string]interface{}, nutriscore string) bool {
	// Define thresholds
	const (
		maxCalories     = 400 // Maximum acceptable calories per 100g
		maxFat          = 17  // Maximum acceptable fat per 100g
		maxSaturatedFat = 5   // Maximum acceptable saturated fat per 100g
		maxSugar        = 15  // Maximum acceptable sugar per 100g
		maxSalt         = 1.5 // Maximum acceptable salt per 100g
	)

	// Consider the Nutri-Score
	switch nutriscore {
	case "a", "b":
		// Generally considered healthy
		return true
	case "c":
		// Moderately healthy
		break
	case "d", "e":
		// Generally not considered healthy
		return false
	}

	// Extract the values from the nutriments map
	calories := getNutrientValue(nutriments, "energy-kcal_100g")
	fat := getNutrientValue(nutriments, "fat_100g")
	saturatedFat := getNutrientValue(nutriments, "saturated-fat_100g")
	sugar := getNutrientValue(nutriments, "sugars_100g")
	salt := getNutrientValue(nutriments, "salt_100g")

	// Apply the thresholds
	if calories > maxCalories || fat > maxFat || saturatedFat > maxSaturatedFat || sugar > maxSugar || salt > maxSalt {
		return false
	}

	return true
}

// getNutrientValue is a helper function to safely extract nutrient values from the map
func getNutrientValue(nutriments map[string]interface{}, key string) float64 {
	if value, ok := nutriments[key]; ok {
		switch v := value.(type) {
		case float64:
			return v
		case int:
			return float64(v)
		}
	}
	return 0
}

// GetProductHandler is the handler to retrieve product details by ID
func GetProductHandler(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		productID := r.URL.Query().Get("product_id")
		if productID == "" {
			http.Error(w, "product_id is required", http.StatusBadRequest)
			return
		}

		productCollection := client.Database("openfoodfacts").Collection("products")

		objectID, err := primitive.ObjectIDFromHex(productID)
		if err != nil {
			http.Error(w, "Invalid product ID", http.StatusBadRequest)
			return
		}

		filter := bson.M{"_id": objectID}
		var product map[string]interface{}
		err = productCollection.FindOne(context.TODO(), filter).Decode(&product)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				http.Error(w, "Product not found", http.StatusNotFound)
			} else {
				log.Println("Error fetching product:", err)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			}
			return
		}

		log.Printf("Product found: %v\n", product)

		imageFields := []string{
			"image_url",
			"image_small_url",
			"image_ingredients_url",
			"image_ingredients_small_url",
			"image_nutrition_url",
			"image_nutrition_small_url",
		}

		images := make(map[string]string)
		for _, field := range imageFields {
			if url, ok := product[field].(string); ok && url != "" {
				images[field] = url
			}
		}

		product["image_urls"] = images

		log.Printf("Sending product response: %v\n", product)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(product)
	}
}
