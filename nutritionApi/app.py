from flask import Flask, request, jsonify
import requests
import base64

# Clarifai et Nutritionix API keys
CLARIFAI_API_KEY = '6eca4fb3f4b44e36816b2b83e8f84f10'
NUTRITIONIX_APP_ID = 'ddc5330d'
NUTRITIONIX_APP_KEY = 'cd23e338784fdeb9b1ae21688f68e29a'

app = Flask(__name__)

# Analyse l'image avec l'API Clarifai
def analyze_image_with_clarifai(image_bytes):
    url = "https://api.clarifai.com/v2/models/food-item-recognition/outputs"
    headers = {
        "Authorization": f"Key {CLARIFAI_API_KEY}",
        "Content-Type": "application/json"
    }

    image_base64 = base64.b64encode(image_bytes).decode('utf-8')
    payload = {
        "inputs": [
            {
                "data": {
                    "image": {
                        "base64": image_base64
                    }
                }
            }
        ]
    }

    response = requests.post(url, json=payload, headers=headers)
    return response.json()

# Obtenir les infos nutritionnelles via Nutritionix API
def get_nutrition_info(ingredient):
    url = "https://trackapi.nutritionix.com/v2/natural/nutrients"
    headers = {
        "x-app-id": NUTRITIONIX_APP_ID,
        "x-app-key": NUTRITIONIX_APP_KEY,
        "Content-Type": "application/json"
    }
    data = {"query": ingredient, "timezone": "US/Eastern"}
    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        return None

# Route pour analyser l'image et obtenir les informations nutritionnelles
@app.route('/analyze-image', methods=['POST'])
def analyze_image():
    if 'file' not in request.files:
        return jsonify({'error': 'Aucun fichier envoyé'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Fichier non sélectionné'}), 400

    image_bytes = file.read()

    # Analyse l'image avec Clarifai
    clarifai_response = analyze_image_with_clarifai(image_bytes)

    if not clarifai_response or 'outputs' not in clarifai_response:
        return jsonify({'error': 'Échec de l\'analyse de l\'image'}), 500

    # Utiliser un seuil de confiance
    confidence_threshold = 0.5
    ingredients = [concept['name'] for concept in clarifai_response['outputs'][0]['data']['concepts'] if concept['value'] > confidence_threshold]

    if not ingredients:
        return jsonify({'error': 'Aucun ingrédient détecté'}), 400

    # Collecte des informations nutritionnelles
    nutrition_data = []
    total_calories = 0
    for ingredient in ingredients:
        nutrition_info = get_nutrition_info(ingredient)

        # Calcule les calories et autres détails pour chaque ingrédient si trouvé
        if nutrition_info and "foods" in nutrition_info:
            food_info = nutrition_info["foods"][0]
            calories = food_info.get("nf_calories", 0)
            total_calories += calories

            nutrition_data.append({
                "ingredient": ingredient,
                "calories": calories,
                "protein": food_info.get("nf_protein", 0),
                "carbohydrates": food_info.get("nf_total_carbohydrate", 0),
                "fat": food_info.get("nf_total_fat", 0),
                "sugars": food_info.get("nf_sugars", 0)
            })
        else:
            nutrition_data.append({"ingredient": ingredient, "error": "Aucune donnée nutritionnelle trouvée"})

    return jsonify({
        "ingredients": ingredients,
        "nutrition_data": nutrition_data,
        "total_calories": total_calories
    }), 200

if __name__ == '__main__':
    app.run(debug=True)
