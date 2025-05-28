import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as morgan from "morgan";
import helmet from "helmet";
import { DurationInterceptor } from "./interceptors/duration/duration.interceptor";
import { ConfigService } from "@nestjs/config"; // ✅ Import correct

async function bootstrap() {
  // Création de l'application NestJS à partir du module principal
  const app = await NestFactory.create(AppModule);

  // Récupération du service de configuration pour accéder aux variables d'environnement
  const configService = app.get(ConfigService); // ✅ Bonne façon de récupérer le service

  // Configuration des options CORS pour autoriser l'origine du front local
  const corsOptions = {
    origin: ["http://localhost:4200"],
  };

  // Activation de CORS avec les options spécifiées
  app.enableCors(corsOptions);

  // Sécurisation des en-têtes HTTP avec Helmet
  app.use(helmet());

  // Utilisation de Morgan pour logger les requêtes HTTP en mode 'dev'
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(morgan("dev"));

  // Middleware personnalisé déclaré directement ici pour logguer à chaque requête
  app.use((req, res, next) => {
    console.log("Middleware from app.use");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    next();
  });

  // Application globale de la validation des DTOs avec pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Transforme automatiquement les données en types attendus
      whitelist: true, // Supprime les propriétés non définies dans les DTOs
      forbidNonWhitelisted: true, // Retourne une erreur si des propriétés non autorisées sont envoyées
    }),
  );

  // Application globale d’un interceptor pour mesurer la durée d’exécution des requêtes
  app.useGlobalInterceptors(new DurationInterceptor());

  // Récupération du port depuis la config ou fallback sur 3000
  const port = configService.get<number>("APP_PORT") || 3000;

  // Lancement de l’application sur le port spécifié
  await app.listen(port);

  // Message console indiquant que le serveur est bien lancé
  console.log(`Application is running on port ${port}`); // ✅ Affichage visible en console
}
void bootstrap();
