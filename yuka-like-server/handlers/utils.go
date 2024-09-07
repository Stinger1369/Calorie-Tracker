package handlers

import (
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// SaveUserScanHistory function to save or update user scan history
func SaveUserScanHistory(client *mongo.Client, userID, code, productID string) {
	scanCollection := client.Database("openfoodfacts").Collection("user_scans")

	filter := bson.M{"user_id": userID, "scans.product_id": productID}
	update := bson.M{
		"$set": bson.M{
			"scans.$.timestamp": time.Now(),
		},
	}

	result, err := scanCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		log.Println("Error updating scan history:", err)
		return
	}

	if result.MatchedCount == 0 {
		filter = bson.M{"user_id": userID}
		update = bson.M{
			"$push": bson.M{
				"scans": ProductScan{
					ProductID: productID,
					Code:      code,
					Timestamp: time.Now(),
				},
			},
		}

		_, err = scanCollection.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			log.Println("Error saving scan history:", err)
		}
	}
}

// FilterNutriments filters the relevant nutriments from the product data
func FilterNutriments(product map[string]interface{}) map[string]interface{} {
	nutrientFields := []string{
		"energy-kcal_100g", "fat_100g", "saturated-fat_100g", "carbohydrates_100g", "sugars_100g", "proteins_100g", "salt_100g",
	}

	filteredNutriments := make(map[string]interface{})
	for _, field := range nutrientFields {
		if value, ok := product[field]; ok {
			filteredNutriments[field] = value
		}
	}

	return filteredNutriments
}

// FilterIngredients filters the ingredients with non-zero percentages
func FilterIngredients(product map[string]interface{}) []map[string]interface{} {
	filteredIngredients := []map[string]interface{}{}
	if ingredients, ok := product["ingredients"].([]interface{}); ok {
		for _, ingredient := range ingredients {
			ingMap := ingredient.(map[string]interface{})
			if percent, ok := ingMap["percent_estimate"].(float64); ok && percent > 0 {
				filteredIngredients = append(filteredIngredients, ingMap)
			}
		}
	}
	return filteredIngredients
}

// GetNutriscoreGrade retrieves the Nutriscore grade
func GetNutriscoreGrade(product map[string]interface{}) string {
	if nutriscore, ok := product["nutriscore_grade"].(string); ok {
		return nutriscore
	}
	return "unknown"
}

// GetImageURLs retrieves image URLs from the product document
func GetImageURLs(product map[string]interface{}) map[string]string {
	imageFields := []string{
		"image_url", "image_small_url", "image_ingredients_url", "image_nutrition_url",
	}

	images := make(map[string]string)
	for _, field := range imageFields {
		if url, ok := product[field].(string); ok && url != "" {
			images[field] = url
		}
	}

	return images
}

// IsHealthy determines if a product is healthy based on its nutriments and Nutri-Score
func IsHealthy(nutriments map[string]interface{}, nutriscore string) bool {
	const (
		maxCalories     = 400
		maxFat          = 17
		maxSaturatedFat = 5
		maxSugar        = 15
		maxSalt         = 1.5
	)

	switch nutriscore {
	case "a", "b":
		return true
	case "d", "e":
		return false
	}

	calories := getNutrientValue(nutriments, "energy-kcal_100g")
	fat := getNutrientValue(nutriments, "fat_100g")
	saturatedFat := getNutrientValue(nutriments, "saturated-fat_100g")
	sugar := getNutrientValue(nutriments, "sugars_100g")
	salt := getNutrientValue(nutriments, "salt_100g")

	return calories <= maxCalories && fat <= maxFat && saturatedFat <= maxSaturatedFat && sugar <= maxSugar && salt <= maxSalt
}

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
