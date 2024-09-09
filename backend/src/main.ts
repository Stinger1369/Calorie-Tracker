import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as morgan from 'morgan';
import { existsSync, readdirSync } from 'fs';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Middleware pour logger chaque requête HTTP
  app.use(morgan('combined'));

  // Utiliser les pipes de validation globalement
  app.useGlobalPipes(new ValidationPipe());

  // Activer CORS pour permettre les requêtes depuis d'autres domaines
  app.enableCors({
    origin: '*', // Autorise toutes les origines
  });

  // Augmenter la limite de taille maximale pour les requêtes JSON et les données encodées en URL
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Configuration de Swagger
  const config = new DocumentBuilder()
    .setTitle('Calorie Tracker API')
    .setDescription('API documentation for the Calorie Tracker application')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Utiliser un chemin absolu pour les fichiers statiques
  const staticAssetsPath = 'J:/calorie/backend/src/assets/Images/FoodImages';
  console.log('Chemin absolu vers les images:', staticAssetsPath);

  // Vérifier si le dossier existe
  if (existsSync(staticAssetsPath)) {
    console.log('Le dossier des images existe.');

    // Lister les fichiers dans le dossier
    const files = readdirSync(staticAssetsPath);
    console.log('Fichiers dans le dossier:', files);

    // Servir les fichiers statiques pour les images d'aliments
    app.useStaticAssets(staticAssetsPath, {
      prefix: '/images/food/',
    });
  } else {
    console.error("Le dossier des images n'existe pas:", staticAssetsPath);
  }

  // Ajouter le dossier public pour le module d'images
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/images/',
  });

  // Middleware pour logger toutes les requêtes
  app.use((req, res, next) => {
    console.log(`Requête reçue: ${req.method} ${req.url}`);
    next();
  });

  // Écouter sur toutes les interfaces réseau
  await app.listen(3000, '0.0.0.0'); // Ici, on spécifie l'adresse '0.0.0.0' pour écouter sur toutes les interfaces réseau.
  console.log('Backend is listening on port 3000');
}

bootstrap();
