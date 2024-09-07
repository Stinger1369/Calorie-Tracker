package db

import (
    "context"
    "fmt"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "log"
)

func ConnectDB() *mongo.Client {
    // Remplacez "mongodb://localhost:27017/openfoodfacts" par l'URI correct si nécessaire
    clientOptions := options.Client().ApplyURI("mongodb://localhost:27017/openfoodfacts").SetMaxPoolSize(100)

    // Connexion à MongoDB
    client, err := mongo.Connect(context.TODO(), clientOptions)
    if err != nil {
        log.Fatal(err)
    }

    // Vérification de la connexion
    err = client.Ping(context.TODO(), nil)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("Connected to MongoDB!")
    return client
}
