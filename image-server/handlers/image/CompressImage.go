package image

import (
	"errors"
	"github.com/nfnt/resize"
	"golang.org/x/image/webp"
	"image"
	"image-server/utils"
	"image/jpeg"
	"image/png"
	"io"
	"log"
	"os"
	"path/filepath"
	"strings"
)

// compressImage compresses the image located at filePath and returns the path to the compressed image
func compressImage(filePath string) (string, error) {
	ext := strings.ToLower(filepath.Ext(filePath))
	supportedFormats := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".webp": true,
	}

	// Si le format n'est pas supporté, convertissez l'image en JPEG
	if !supportedFormats[ext] {
		log.Printf("Unsupported image format: %s. Converting to JPEG.", ext)
		var err error
		filePath, err = utils.ConvertImageToJpeg(filePath) // Utilisez la fonction externalisée
		if err != nil {
			return "", err
		}
		ext = ".jpg" // Mise à jour de l'extension après conversion
	}

	file, err := os.Open(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	// Detect image type
	var img image.Image

	switch ext {
	case ".jpg", ".jpeg":
		img, err = jpeg.Decode(file)
		if err != nil {
			return "", errors.New("invalid JPEG format: " + err.Error())
		}
	case ".png":
		img, err = png.Decode(file)
		if err != nil {
			return "", errors.New("invalid PNG format: " + err.Error())
		}
	case ".webp":
		img, err = decodeWebP(file)
		if err != nil {
			return "", errors.New("invalid WebP format: " + err.Error())
		}
	default:
		return "", errors.New("unsupported image format after conversion")
	}

	log.Printf("Image format detected: %s", ext)

	// Resize image
	m := resize.Resize(500, 0, img, resize.Lanczos3)

	// Prepare compressed file path without "_compressed"
	compressedPath := strings.TrimSuffix(filePath, ext)

	// Create compressed file with correct extension
	out, err := os.Create(compressedPath + ".jpg") // Save all as .jpg
	if err != nil {
		return "", err
	}
	defer out.Close()

	// Encode image in JPEG format
	err = jpeg.Encode(out, m, nil)
	if err != nil {
		return "", err
	}

	log.Printf("Compressed image created: %s", compressedPath+".jpg")
	return compressedPath + ".jpg", nil
}

// decodeWebP decodes a WebP image
func decodeWebP(r io.Reader) (image.Image, error) {
	img, err := webp.Decode(r)
	if err != nil {
		return nil, err
	}
	return img, nil
}
