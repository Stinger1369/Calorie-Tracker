package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"yuka-like-server/db"       // Importer le package db
	"yuka-like-server/handlers" // Importer le package handlers
)

func main() {
	router := mux.NewRouter()

	// Connexion à MongoDB
	client := db.ConnectDB()

	// WebSocket endpoint pour scanner un produit
	router.HandleFunc("/ws/products", func(w http.ResponseWriter, r *http.Request) {
		handlers.HandleWebSocketConnection(client, w, r)
	})

	// Démarrer le serveur
	fmt.Println("Starting server on port 8000...")
	log.Fatal(http.ListenAndServe(":8000", router))
}
