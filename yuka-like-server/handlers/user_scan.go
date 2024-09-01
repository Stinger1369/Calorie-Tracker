package handlers

import (
    "context"
    "encoding/json"
    "log"
    "net/http"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
)

func GetUserScansHandler(client *mongo.Client) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        userID := r.URL.Query().Get("user_id")
        if userID == "" {
            http.Error(w, "user_id is required", http.StatusBadRequest)
            return
        }

        scanCollection := client.Database("openfoodfacts").Collection("user_scans")

        filter := bson.M{"user_id": userID}
        var userScans map[string]interface{}
        err := scanCollection.FindOne(context.TODO(), filter).Decode(&userScans)
        if err != nil {
            if err == mongo.ErrNoDocuments {
                http.Error(w, "No scans found for this user", http.StatusNotFound)
            } else {
                log.Println("Error fetching user scans:", err)
                http.Error(w, "Internal Server Error", http.StatusInternalServerError)
            }
            return
        }

        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(userScans)
    }
}

