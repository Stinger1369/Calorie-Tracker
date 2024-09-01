package main

import (
    "fmt"
    "log"
    "net/http"

    "github.com/gorilla/mux"
    "yuka-like-server/db"
    "yuka-like-server/handlers"
)

func main() {
    router := mux.NewRouter()

    // Connexion à MongoDB
    client := db.ConnectDB()

    // WebSocket endpoint pour scanner un produit
    router.HandleFunc("/ws/products", func(w http.ResponseWriter, r *http.Request) {
        handlers.HandleWebSocketConnection(client, w, r)
    })

    // Endpoint pour récupérer l'historique des scans d'un utilisateur
    router.HandleFunc("/api/user_scans", handlers.GetUserScansHandler(client)).Methods("GET")

    // Endpoint pour récupérer les détails d'un produit par ID
    router.HandleFunc("/api/products", handlers.GetProductHandler(client)).Methods("GET")

    // Démarrer le serveur
    fmt.Println("Starting server on port 8090...")
    log.Fatal(http.ListenAndServe(":8090", router))
}
