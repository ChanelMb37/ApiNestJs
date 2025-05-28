import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

// Déclaration de la pipe personnalisée UpperAndFusionPipe
// Cette pipe est utilisée pour transformer des données avant qu'elles n'atteignent le contrôleur
@Injectable()
export class UpperAndFusionPipe implements PipeTransform {
  // La méthode transform applique la transformation sur l'entrée (entry)
  transform(entry: { data: string[] }, metadata: ArgumentMetadata) {
    // Si les données proviennent du corps de la requête (body), on applique la transformation
    if (metadata.type === "body") {
      // On transforme chaque élément du tableau en majuscules, puis on les fusionne avec " -"
      return entry.data.map((element) => element.toUpperCase()).join(" -");
    }

    // Sinon, on retourne l'entrée sans modification
    return entry;
  }
}
