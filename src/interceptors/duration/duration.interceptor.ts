/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

// Intercepteur personnalisé pour mesurer la durée d'exécution d'une requête HTTP
@Injectable()
export class DurationInterceptor implements NestInterceptor {
  // Méthode interceptée à chaque appel HTTP
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now(); // Horodatage du début de la requête

    // Extraction des informations de la requête HTTP (méthode et URL)
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    // Utilisation d'un opérateur RxJS pour exécuter une action à la fin du traitement
    return next.handle().pipe(
      tap(() => {
        const end = Date.now(); // Horodatage de la fin de la requête
        const duration = end - now; // Calcul de la durée d'exécution

        // Affichage en console du temps de traitement et des détails de la requête
        console.log(
          `Request created At : ${now}; request end At: ${end} et Request duration : ${duration}ms;  ${method} ${url}`,
        );
      }),
    );
  }
}
