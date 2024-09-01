package handlers

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options" // Importer le package options
	"log"
	"time"
)

type ProductScan struct {
	ProductID string    `json:"product_id" bson:"product_id"`
	Code      string    `json:"code" bson:"code"`
	Timestamp time.Time `json:"timestamp" bson:"timestamp"`
}

// Enregistrer l'historique du scan dans MongoDB
func saveUserScanHistory(client *mongo.Client, userID, code, productID string) {
	scanCollection := client.Database("openfoodfacts").Collection("user_scans")

	// Rechercher si l'utilisateur a déjà un historique
	filter := bson.M{"user_id": userID, "scans.product_id": productID}

	// Mettre à jour uniquement le timestamp si le produit est déjà scanné
	update := bson.M{
		"$set": bson.M{
			"scans.$.timestamp": time.Now(),
		},
	}

	// Tenter de mettre à jour le document
	result, err := scanCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		log.Println("Error updating scan history:", err)
		return
	}

	if result.MatchedCount == 0 { // Si le produit n'existe pas encore dans les scans
		// Ajouter un nouveau produit à la liste des scans
		filter = bson.M{"user_id": userID} // Rechercher uniquement par user_id
		update = bson.M{
			"$push": bson.M{
				"scans": ProductScan{
					ProductID: productID,
					Code:      code,
					Timestamp: time.Now(),
				},
			},
		}

		// Créer le document s'il n'existe pas encore
		_, err = scanCollection.UpdateOne(context.TODO(), filter, update, options.Update().SetUpsert(true))
		if err != nil {
			log.Println("Error saving scan history:", err)
		}
	}
}
