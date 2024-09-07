install mongodb
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl status mongod

addto databese mongo
mongoimport --db openfoodfacts --collection products --file /home/bil/openfoodfacts-products.jsonl
mongoimport --db openfoodfacts --collection products --file /root/openfoodfacts-products.jsonl --drop
mongoimport --db openfoodfacts --collection products --file /root/openfoodfacts-products.jsonl --mode upsert

mongoimport --db openfoodfacts --collection products --type tsv --file /home/bilouch/en.openfoodfacts.org.products.csv --headerline --ignoreBlanks

mongoimport --db openfoodfacts --collection products --file /home/bil/openfoodfacts.products.json

scp "H:\youtubesport\en.openfoodfacts.org.products.csv/openfoodfacts.products.json" bil@192.168.154.129:/home/bil/


sudo systemctl start mongod
sudo systemctl status mongod

test> use openfoodfacts
switched to db openfoodfacts
openfoodfacts> db.products.createIndex({ "code": 1 })

mongoimport --uri "mongodb://localhost:27017/openfoodfacts" --collection bigData --file "J:\youtubesport\openfoodfacts\openfoodfacts-products.jsonl"
