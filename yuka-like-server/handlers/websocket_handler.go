package handlers

import (
    "context"
    "encoding/json"
    "log"
    "net/http"
    "time"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
    CheckOrigin: func(r *http.Request) bool {
        return true
    },
}

type ProductScan struct {
    ProductID string    `json:"product_id" bson:"product_id"`
    Code      string    `json:"code" bson:"code"`
    Timestamp time.Time `json:"timestamp" bson:"timestamp"`
}

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

        productID, ok := product["_id"].(string)
        if !ok {
            log.Println("Error: Product ID not found or not a string")
            response := map[string]string{"message": "Product ID not found"}
            conn.WriteJSON(response)
            continue
        }

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
            "image_url":    product["images"].(map[string]interface{})["1"].(map[string]interface{})["sizes"].(map[string]interface{})["full"].(map[string]interface{})["w"],
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

// Handler pour récupérer les détails d'un produit par ID
func GetProductHandler(client *mongo.Client) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        productID := r.URL.Query().Get("product_id")
        if productID == "" {
            http.Error(w, "product_id is required", http.StatusBadRequest)
            return
        }

        productCollection := client.Database("openfoodfacts").Collection("products")

        filter := bson.M{"_id": productID}
        var product map[string]interface{}
        err := productCollection.FindOne(context.TODO(), filter).Decode(&product)
        if err != nil {
            if err == mongo.ErrNoDocuments {
                http.Error(w, "Product not found", http.StatusNotFound)
            } else {
                log.Println("Error fetching product:", err)
                http.Error(w, "Internal Server Error", http.StatusInternalServerError)
            }
            return
        }

        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(product)
    }
}
