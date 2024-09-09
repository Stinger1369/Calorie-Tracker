import json

# Ouvrir et lire le fichier texte
with open('groupemusculaire.txt', 'r', encoding='utf-8') as file:
    lines = file.readlines()

# Initialisation du dictionnaire
groupe_musculaire_urls = {}
current_muscle_group = None

# Parcourir chaque ligne du fichier
for line in lines:
    line = line.strip()  # Supprime les espaces en début et fin de ligne
    if not line.startswith('https://'):  # Si ce n'est pas une URL, c'est un groupe musculaire
        current_muscle_group = line
        groupe_musculaire_urls[current_muscle_group] = []
    elif current_muscle_group:  # Ajouter l'URL à la liste du groupe musculaire actuel
        groupe_musculaire_urls[current_muscle_group].append(line)

# Enregistrer le dictionnaire dans un fichier JSON
with open('pretest.json', 'w', encoding='utf-8') as json_file:
    json.dump(groupe_musculaire_urls, json_file, ensure_ascii=False, indent=4)

print("Le fichier 'pretest.json' a été créé avec succès.")
