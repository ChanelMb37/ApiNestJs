import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TodoModule } from "./todo/todo.module";
import { FirstMiddleware } from "./middlewares/first/first.middleware";
import { logger } from "./middlewares/Logger.middleware";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CvModule } from "./cv/cv.module";
import { UserModule } from "./user/user.module";
import { AuthController } from "./auth/auth.controller";
import * as dotenv from "dotenv";

dotenv.config(); // ✅ Chargement manuel des variables d'environnement à partir du fichier .env

// Déclaration du module principal de l'application
@Module({
  imports: [
    // Module métier pour les ToDos
    TodoModule,

    // Configuration globale (variables d'environnement disponibles partout)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Configuration de la connexion à la base de données MySQL avec TypeORM
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? "3306", 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + "/**/*.entity{.ts,.js}"], // Chemin des entités
      synchronize: true, // ⚠️ Synchronisation automatique : à désactiver en production
    }),

    // Autres modules métier
    CvModule,
    UserModule,
  ],
  controllers: [AppController, AuthController], // Déclaration des contrôleurs principaux
  providers: [AppService], // Fournisseur principal (services injectables)
})
export class AppModule implements NestModule {
  constructor(private readonly appService: AppService) {}

  // Configuration des middlewares spécifiques à certaines routes
  configure(consumer: MiddlewareConsumer): void {
    consumer
      // Middleware personnalisé appliqué à des routes précises
      .apply(FirstMiddleware)
      .forRoutes(
        "hello",
        { path: "todo", method: RequestMethod.GET },
        { path: "todo/*", method: RequestMethod.DELETE },
      )
      // Middleware logger appliqué à toutes les routes
      .apply(logger)
      .forRoutes("*");
  }
}
