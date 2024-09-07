package handlers

import (
	"context"
	"log"

	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// GetProductByCode retrieves a product by its code (used as _id)
func GetProductByCode(client *mongo.Client, code string) (map[string]interface{}, error) {
	collection := client.Database("openfoodfacts").Collection("products")

	objectID, err := primitive.ObjectIDFromHex(code)
	if err != nil {
		log.Println("Invalid code format:", err)
		return nil, errors.New("Invalid product code")
	}

	filter := bson.M{"_id": objectID}
	var product map[string]interface{}
	err = collection.FindOne(context.TODO(), filter).Decode(&product)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Printf("No product found with code: %s\n", code)
			return nil, errors.New("Product not found")
		}
		log.Println("Error fetching product:", err)
		return nil, errors.New("Internal Server Error")
	}

	return product, nil
}

// GetProductHandler is the HTTP handler to retrieve product details by ID
func GetProductHandler(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		productID := r.URL.Query().Get("product_id")
		if productID == "" {
			http.Error(w, "product_id is required", http.StatusBadRequest)
			return
		}

		product, err := GetProductByCode(client, productID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(product)
	}
}
