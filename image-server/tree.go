package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func main() {
	root := "."

	// Liste des répertoires à ignorer
	ignoredDirs := []string{"venv", "go", "node_modules", "build"}

	printTree(root, "", ignoredDirs)
}

func printTree(root, prefix string, ignoredDirs []string) {
	files, err := os.ReadDir(root)
	if err != nil {
		fmt.Println("Error reading directory:", err)
		return
	}

	for i, file := range files {
		// Ignorer les répertoires spécifiés
		shouldIgnore := false
		for _, ignoredDir := range ignoredDirs {
			if file.IsDir() && strings.HasPrefix(file.Name(), ignoredDir) {
				shouldIgnore = true
				break
			}
		}

		if shouldIgnore {
			continue
		}

		// Déterminer le préfixe pour l'affichage
		connector := "├── "
		if i == len(files)-1 {
			connector = "└── "
		}

		fmt.Println(prefix + connector + file.Name())

		// Si c'est un répertoire, appeler récursivement printTree
		if file.IsDir() {
			newPrefix := prefix + "│   "
			if i == len(files)-1 {
				newPrefix = prefix + "    "
			}
			printTree(filepath.Join(root, file.Name()), newPrefix, ignoredDirs)
		}
	}
}
