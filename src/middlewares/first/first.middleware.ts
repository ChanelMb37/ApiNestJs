import { Injectable, NestMiddleware } from "@nestjs/common";

// Déclaration du middleware personnalisé FirstMiddleware
// Il implémente l'interface NestMiddleware pour pouvoir s'insérer dans le cycle de traitement des requêtes
@Injectable()
export class FirstMiddleware implements NestMiddleware {
  // La méthode use est automatiquement appelée lors du passage d'une requête par ce middleware
  use(req: Request, res: Response, next: () => void) {
    // Ce middleware affiche un message dans la console à chaque requête interceptée
    console.log("Je suis le premier middleware");

    // Appel de next() pour passer au middleware ou handler suivant dans la chaîne
    next();
  }
}
