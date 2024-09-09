import os
import requests
import pandas as pd

# Charger le fichier CSV
csv_file_path = 'full_with_refined_calories.csv'
data = pd.read_csv(csv_file_path)

# Créer un dossier pour stocker les images
image_folder_path = 'image'  # Remplace par le chemin du dossier où tu veux sauvegarder les images
os.makedirs(image_folder_path, exist_ok=True)

# Fonction pour télécharger une image à partir de l'URL
def download_image(image_url, save_folder, title):
    try:
        # Faire une requête GET à l'URL de l'image
        response = requests.get(image_url, stream=True)
        if response.status_code == 200:
            # Nettoyer le nom du fichier image basé sur le titre de l'exercice
            image_name = f"{title.replace(' ', '_').lower()}.jpg"
            image_path = os.path.join(save_folder, image_name)

            # Sauvegarder l'image
            with open(image_path, 'wb') as f:
                f.write(response.content)
            print(f"Téléchargé : {image_path}")
        else:
            print(f"Erreur lors du téléchargement de l'image depuis {image_url}")
    except Exception as e:
        print(f"Erreur lors du téléchargement de l'image {title}: {e}")

# Parcourir les lignes du CSV et télécharger les images
for index, row in data.iterrows():
    image_url = row['Image URL']
    title = row['Title']
    download_image(image_url, image_folder_path, title)

print("Téléchargement des images terminé.")
