import pymongo
from tqdm import tqdm

# Connexion à la base de données MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["openfoodfacts"]
collection = db["products"]

# Liste des champs à séparer
fields = [
    "code", "url", "creator", "created_t", "created_datetime", "last_modified_t",
    "last_modified_datetime", "last_modified_by", "last_updated_t", "last_updated_datetime",
    "product_name", "abbreviated_product_name", "generic_name", "quantity", "packaging",
    "packaging_tags", "packaging_en", "packaging_text", "brands", "brands_tags", "categories",
    "categories_tags", "categories_en", "origins", "origins_tags", "origins_en",
    "manufacturing_places", "manufacturing_places_tags", "labels", "labels_tags", "labels_en",
    "emb_codes", "emb_codes_tags", "first_packaging_code_geo", "cities", "cities_tags",
    "purchase_places", "stores", "countries", "countries_tags", "countries_en",
    "ingredients_text", "ingredients_tags", "ingredients_analysis_tags", "allergens",
    "allergens_en", "traces", "traces_tags", "traces_en", "serving_size", "serving_quantity",
    "no_nutrition_data", "additives_n", "additives", "additives_tags", "additives_en",
    "nutriscore_score", "nutriscore_grade", "nova_group", "pnns_groups_1", "pnns_groups_2",
    "food_groups", "food_groups_tags", "food_groups_en", "states", "states_tags", "states_en",
    "brand_owner", "ecoscore_score", "ecoscore_grade", "nutrient_levels_tags", "product_quantity",
    "owner", "data_quality_errors_tags", "unique_scans_n", "popularity_tags", "completeness",
    "last_image_t", "last_image_datetime", "main_category", "main_category_en", "image_url",
    "image_small_url", "image_ingredients_url", "image_ingredients_small_url", "image_nutrition_url",
    "image_nutrition_small_url", "energy-kj_100g", "energy-kcal_100g", "energy_100g",
    "energy-from-fat_100g", "fat_100g", "saturated-fat_100g", "butyric-acid_100g",
    "caproic-acid_100g", "caprylic-acid_100g", "capric-acid_100g", "lauric-acid_100g",
    "myristic-acid_100g", "palmitic-acid_100g", "stearic-acid_100g", "arachidic-acid_100g",
    "behenic-acid_100g", "lignoceric-acid_100g", "cerotic-acid_100g", "montanic-acid_100g",
    "melissic-acid_100g", "unsaturated-fat_100g", "monounsaturated-fat_100g", "omega-9-fat_100g",
    "polyunsaturated-fat_100g", "omega-3-fat_100g", "omega-6-fat_100g", "alpha-linolenic-acid_100g",
    "eicosapentaenoic-acid_100g", "docosahexaenoic-acid_100g", "linoleic-acid_100g",
    "arachidonic-acid_100g", "gamma-linolenic-acid_100g", "dihomo-gamma-linolenic-acid_100g",
    "oleic-acid_100g", "elaidic-acid_100g", "gondoic-acid_100g", "mead-acid_100g",
    "erucic-acid_100g", "nervonic-acid_100g", "trans-fat_100g", "cholesterol_100g",
    "carbohydrates_100g", "sugars_100g", "added-sugars_100g", "sucrose_100g", "glucose_100g",
    "fructose_100g", "lactose_100g", "maltose_100g", "maltodextrins_100g", "starch_100g",
    "polyols_100g", "erythritol_100g", "fiber_100g", "soluble-fiber_100g", "insoluble-fiber_100g",
    "proteins_100g", "casein_100g", "serum-proteins_100g", "nucleotides_100g", "salt_100g",
    "added-salt_100g", "sodium_100g", "alcohol_100g", "vitamin-a_100g", "beta-carotene_100g",
    "vitamin-d_100g", "vitamin-e_100g", "vitamin-k_100g", "vitamin-c_100g", "vitamin-b1_100g",
    "vitamin-b2_100g", "vitamin-pp_100g", "vitamin-b6_100g", "vitamin-b9_100g", "folates_100g",
    "vitamin-b12_100g", "biotin_100g", "pantothenic-acid_100g", "silica_100g", "bicarbonate_100g",
    "potassium_100g", "chloride_100g", "calcium_100g", "phosphorus_100g", "iron_100g",
    "magnesium_100g", "zinc_100g", "copper_100g", "manganese_100g", "fluoride_100g",
    "selenium_100g", "chromium_100g", "molybdenum_100g", "iodine_100g", "caffeine_100g",
    "taurine_100g", "ph_100g", "fruits-vegetables-nuts_100g", "fruits-vegetables-nuts-dried_100g",
    "fruits-vegetables-nuts-estimate_100g", "fruits-vegetables-nuts-estimate-from-ingredients_100g",
    "collagen-meat-protein-ratio_100g", "cocoa_100g", "chlorophyl_100g", "carbon-footprint_100g",
    "carbon-footprint-from-meat-or-fish_100g", "nutrition-score-fr_100g", "nutrition-score-uk_100g",
    "glycemic-index_100g", "water-hardness_100g", "choline_100g", "phylloquinone_100g",
    "beta-glucan_100g", "inositol_100g", "carnitine_100g", "sulphate_100g", "nitrate_100g",
    "acidity_100g"
]

# Nom du champ long à diviser
long_field_name = 'code\turl\tcreator\tcreated_t\tcreated_datetime\tlast_modified_t\tlast_modified_datetime\tlast_modified_by\tlast_updated_t\tlast_updated_datetime\tproduct_name\tabbreviated_product_name\tgeneric_name\tquantity\tpackaging\tpackaging_tags\tpackaging_en\tpackaging_text\tbrands\tbrands_tags\tcategories\tcategories_tags\tcategories_en\torigins\torigins_tags\torigins_en\tmanufacturing_places\tmanufacturing_places_tags\tlabels\tlabels_tags\tlabels_en\temb_codes\temb_codes_tags\tfirst_packaging_code_geo\tcities\tcities_tags\tpurchase_places\tstores\tcountries\tcountries_tags\tcountries_en\tingredients_text\tingredients_tags\tingredients_analysis_tags\tallergens\tallergens_en\ttraces\ttraces_tags\ttraces_en\tserving_size\tserving_quantity\tno_nutrition_data\tadditives_n\tadditives\tadditives_tags\tadditives_en\tnutriscore_score\tnutriscore_grade\tnova_group\tpnns_groups_1\tpnns_groups_2\tfood_groups\tfood_groups_tags\tfood_groups_en\tstates\tstates_tags\tstates_en\tbrand_owner\tecoscore_score\tecoscore_grade\tnutrient_levels_tags\tproduct_quantity\towner\tdata_quality_errors_tags\tunique_scans_n\tpopularity_tags\tcompleteness\tlast_image_t\tlast_image_datetime\tmain_category\tmain_category_en\timage_url\timage_small_url\timage_ingredients_url\timage_ingredients_small_url\timage_nutrition_url\timage_nutrition_small_url\tenergy-kj_100g\tenergy-kcal_100g\tenergy_100g\tenergy-from-fat_100g\tfat_100g\tsaturated-fat_100g\tbutyric-acid_100g\tcaproic-acid_100g\tcaprylic-acid_100g\tcapric-acid_100g\tlauric-acid_100g\tmyristic-acid_100g\tpalmitic-acid_100g\tstearic-acid_100g\tarachidic-acid_100g\tbehenic-acid_100g\tlignoceric-acid_100g\tcerotic-acid_100g\tmontanic-acid_100g\tmelissic-acid_100g\tunsaturated-fat_100g\tmonounsaturated-fat_100g\tomega-9-fat_100g\tpolyunsaturated-fat_100g\tomega-3-fat_100g\tomega-6-fat_100g\talpha-linolenic-acid_100g\teicosapentaenoic-acid_100g\tdocosahexaenoic-acid_100g\tlinoleic-acid_100g\tarachidonic-acid_100g\tgamma-linolenic-acid_100g\tdihomo-gamma-linolenic-acid_100g\toleic-acid_100g\telaidic-acid_100g\tgondoic-acid_100g\tmead-acid_100g\terucic-acid_100g\tnervonic-acid_100g\ttrans-fat_100g\tcholesterol_100g\tcarbohydrates_100g\tsugars_100g\tadded-sugars_100g\tsucrose_100g\tglucose_100g\tfructose_100g\tlactose_100g\tmaltose_100g\tmaltodextrins_100g\tstarch_100g\tpolyols_100g\terythritol_100g\tfiber_100g\tsoluble-fiber_100g\tinsoluble-fiber_100g\tproteins_100g\tcasein_100g\tserum-proteins_100g\tnucleotides_100g\tsalt_100g\tadded-salt_100g\tsodium_100g\talcohol_100g\tvitamin-a_100g\tbeta-carotene_100g\tvitamin-d_100g\tvitamin-e_100g\tvitamin-k_100g\tvitamin-c_100g\tvitamin-b1_100g\tvitamin-b2_100g\tvitamin-pp_100g\tvitamin-b6_100g\tvitamin-b9_100g\tfolates_100g\tvitamin-b12_100g\tbiotin_100g\tpantothenic-acid_100g\tsilica_100g\tbicarbonate_100g\tpotassium_100g\tchloride_100g\tcalcium_100g\tphosphorus_100g\tiron_100g\tmagnesium_100g\tzinc_100g\tcopper_100g\tmanganese_100g\tfluoride_100g\tselenium_100g\tchromium_100g\tmolybdenum_100g\tiodine_100g\tcaffeine_100g\ttaurine_100g\tph_100g\tfruits-vegetables-nuts_100g\tfruits-vegetables-nuts-dried_100g\tfruits-vegetables-nuts-estimate_100g\tfruits-vegetables-nuts-estimate-from-ingredients_100g\tcollagen-meat-protein-ratio_100g\tcocoa_100g\tchlorophyl_100g\tcarbon-footprint_100g\tcarbon-footprint-from-meat-or-fish_100g\tnutrition-score-fr_100g\tnutrition-score-uk_100g\tglycemic-index_100g\twater-hardness_100g\tcholine_100g\tphylloquinone_100g\tbeta-glucan_100g\tinositol_100g\tcarnitine_100g\tsulphate_100g\tnitrate_100g\tacidity_100g'

# Compter le nombre total de documents
total_documents = collection.count_documents({long_field_name: {"$exists": True}})

# Traiter chaque document pour le restructurer
for document in tqdm(collection.find({long_field_name: {"$exists": True}}), total=total_documents, desc="Migration en cours"):
    # Diviser la chaîne unique en champs individuels
    values = document[long_field_name].split('\t')

    # Supprimer l'ancien champ
    del document[long_field_name]

    # Mapper les valeurs aux champs corrects
    for i, field in enumerate(fields):
        if i < len(values):
            document[field] = values[i] if values[i] != '' else None
        else:
            document[field] = None

    # Mettre à jour le document avec les champs séparés
    collection.replace_one({'_id': document['_id']}, document)

print("Migration terminée.")