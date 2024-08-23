package utils

import (
	"fmt"
	"os/exec"
	"path/filepath"
	"strings"
)

// ConvertImageToJpeg convertit un fichier image (de n'importe quel format) en JPEG à l'aide de la commande ImageMagick.
func ConvertImageToJpeg(filePath string) (string, error) {
	outputFilePath := strings.TrimSuffix(filePath, filepath.Ext(filePath)) + ".jpg"
	cmd := exec.Command("magick", "convert", filePath, outputFilePath)
	err := cmd.Run()
	if err != nil {
		return "", fmt.Errorf("failed to convert image to JPEG: %v", err)
	}
	return outputFilePath, nil
}
