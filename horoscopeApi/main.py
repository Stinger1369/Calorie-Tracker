from fastapi import FastAPI
import openai
from datetime import datetime
from dotenv import load_dotenv
import os

app = FastAPI()

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

# Récupérer la clé API depuis les variables d'environnement
openai.api_key = os.getenv("OPENAI_API_KEY")

# Traduction des signes astrologiques en français
zodiac_signs_fr = {
    "Aries": "Bélier",
    "Taurus": "Taureau",
    "Gemini": "Gémeaux",
    "Cancer": "Cancer",
    "Leo": "Lion",
    "Virgo": "Vierge",
    "Libra": "Balance",
    "Scorpio": "Scorpion",
    "Sagittarius": "Sagittaire",
    "Capricorn": "Capricorne",
    "Aquarius": "Verseau",
    "Pisces": "Poissons"
}

@app.get("/horoscope")
def get_horoscope(
    date_of_birth: str,
    first_name: str,
    last_name: str,
    bmi: float
):
    sign = determine_zodiac_sign(date_of_birth)
    sign_fr = zodiac_signs_fr.get(sign, "Inconnu")

    # Générer l'horoscope avec le prénom, nom et l'IMC
    horoscope = generate_horoscope(sign_fr, first_name, last_name, bmi)

    return {
        "date_of_birth": date_of_birth,
        "zodiac_sign": sign_fr,
        "horoscope": horoscope
    }


def determine_zodiac_sign(date_of_birth):
    birth_date = datetime.strptime(date_of_birth, "%Y-%m-%d")
    # Détermination du signe astrologique basé sur la date
    if (birth_date.month == 3 and birth_date.day >= 21) or (birth_date.month == 4 and birth_date.day <= 19):
        return "Aries"
    elif (birth_date.month == 4 and birth_date.day >= 20) or (birth_date.month == 5 and birth_date.day <= 20):
        return "Taurus"
    elif (birth_date.month == 5 and birth_date.day >= 21) or (birth_date.month == 6 and birth_date.day <= 21):
        return "Gemini"
    elif (birth_date.month == 6 and birth_date.day >= 22) or (birth_date.month == 7 and birth_date.day <= 22):
        return "Cancer"
    elif (birth_date.month == 7 and birth_date.day >= 23) or (birth_date.month == 8 and birth_date.day <= 22):
        return "Leo"
    elif (birth_date.month == 8 and birth_date.day >= 23) or (birth_date.month == 9 and birth_date.day <= 22):
        return "Virgo"
    elif (birth_date.month == 9 and birth_date.day >= 23) or (birth_date.month == 10 and birth_date.day <= 22):
        return "Libra"
    elif (birth_date.month == 10 and birth_date.day >= 23) or (birth_date.month == 11 and birth_date.day <= 21):
        return "Scorpio"
    elif (birth_date.month == 11 and birth_date.day >= 22) or (birth_date.month == 12 and birth_date.day <= 21):
        return "Sagittarius"
    elif (birth_date.month == 12 and birth_date.day >= 22) or (birth_date.month == 1 and birth_date.day <= 19):
        return "Capricorn"
    elif (birth_date.month == 1 and birth_date.day >= 20) or (birth_date.month == 2 and birth_date.day <= 18):
        return "Aquarius"
    elif (birth_date.month == 2 and birth_date.day >= 19) or (birth_date.month == 3 and birth_date.day <= 20):
        return "Pisces"

def generate_horoscope(sign, first_name, last_name, bmi):
    # Définir une description générale de l'état de l'IMC pour l'IA
    bmi_description = f"Votre IMC est de {bmi:.2f}."

    # Construire le prompt pour l'IA en intégrant le prénom, le nom, et l'IMC
    prompt = (
        f"Bonjour {first_name} {last_name}, "
        f"{bmi_description} "
        f"Génère un horoscope quotidien pour le signe astrologique {sign} "
        f"en trois catégories : Santé, Amour, et Travail. "
        f"Le conseil de santé doit tenir compte de l'IMC de l'utilisateur, "
        f"mais les phrases doivent être différentes à chaque fois. "
        f"Réponds en français avec des conseils clairs et dynamiques."
    )

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Tu es un assistant qui génère des horoscopes quotidiens personnalisés."},
            {"role": "user", "content": prompt}
        ]
    )

    # Retourner l'horoscope généré
    return response.choices[0].message['content'].strip()