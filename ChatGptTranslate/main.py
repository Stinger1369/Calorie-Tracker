from fastapi import FastAPI, HTTPException
import openai
from dotenv import load_dotenv
import os

app = FastAPI()

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

# Récupérer la clé API depuis les variables d'environnement
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.post("/translate_recipe")
async def translate_recipe(recipe: dict, language: str = "fr"):
    """
    Service pour traduire une recette en plusieurs langues.
    :param recipe: Un dictionnaire contenant 'Title', 'Ingredients', et 'Instructions'.
    :param language: La langue cible pour la traduction (par défaut "fr" pour français).
    :return: La recette traduite dans la langue choisie.
    """
    supported_languages = {
        "fr": "français",
        "ar": "arabe",
        "es": "espagnol"
    }

    if language not in supported_languages:
        raise HTTPException(status_code=400, detail="Langue non supportée.")

    # Construire le prompt pour l'IA
    prompt = (
        f"Traduisez la recette suivante en {supported_languages[language]} :\n\n"
        f"Titre : {recipe['Title']}\n"
        f"Ingrédients : {recipe['Ingredients']}\n"
        f"Instructions : {recipe['Instructions']}\n\n"
        f"Assurez-vous que la traduction soit précise et adaptée à un contexte culinaire."
    )

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Tu es un assistant qui aide à traduire des recettes culinaires."},
                {"role": "user", "content": prompt}
            ]
        )
        translated_content = response.choices[0].message["content"].strip()

        return {"translated_recipe": translated_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la traduction: {str(e)}")

# Exemple de requête
@app.get("/example")
def example_request(language: str = "fr"):
    example_recipe = {
        "Title": "Spaghetti Carbonara",
        "Ingredients": "Spaghetti, eggs, pancetta, Parmesan cheese, black pepper",
        "Instructions": "Cook spaghetti. In a bowl, whisk eggs and Parmesan. Cook pancetta until crispy. Toss pasta with pancetta and then mix in egg mixture. Serve immediately."
    }
    return translate_recipe(example_recipe, language)
