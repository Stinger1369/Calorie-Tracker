package image

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func AjouterImage(c *gin.Context) {
	log.Println("Received request to add image")

	userID := c.PostForm("user_id")
	imageName := c.PostForm("nom")
	file, err := c.FormFile("image")
	if err != nil {
		log.Printf("Error retrieving the image: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid image file"})
		return
	}

	if userID == "" {
		log.Println("UserID is empty")
		c.JSON(http.StatusBadRequest, gin.H{"error": "UserID is required"})
		return
	}

	userDir := filepath.Join("public/images", userID)
	if _, err := os.Stat(userDir); os.IsNotExist(err) {
		err = os.MkdirAll(userDir, os.ModePerm)
		if err != nil {
			log.Printf("Error creating user directory: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user directory"})
			return
		}
		log.Printf("Created user directory: %s", userDir)
	} else {
		log.Printf("User directory already exists: %s", userDir)
	}

	filePath := filepath.Join(userDir, imageName)
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		log.Printf("Error saving the image: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
		return
	}

	log.Printf("Image successfully saved: %s", filePath)
	imageURL := "/images/" + filepath.Join(userID, imageName)
	c.JSON(http.StatusOK, gin.H{"link": imageURL})
}
