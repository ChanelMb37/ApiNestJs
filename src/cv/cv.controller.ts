/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Désactive certaines règles ESLint spécifiques à TypeScript. Cela peut être utile en développement
// mais idéalement, on essaiera de corriger ces erreurs pour garder un code propre.

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common"; // Import des décorateurs NestJS pour définir les routes et les méthodes

import { CvService } from "./cv.service"; // Service métier pour les opérations sur les CV
import { CvEntity } from "./entities/cv.entity/cv.entity"; // Entité représentant un CV
import { AddCvDto } from "./dto/Add-cv.dto"; // DTO pour la création de CV
import { UpdateCvDto } from "./dto/update-cv.dto"; // DTO pour la mise à jour d’un CV
import { JwtAuthGuard } from "src/user/Guards/jwt-auth.guard.ts"; // Garde d’authentification JWT
import { User } from "src/decorators/user.decorator"; // Décorateur personnalisé pour récupérer l'utilisateur connecté
import { UserEntity } from "src/user/entites/user.entity/user.entity"; // Entité utilisateur

// Déclare un contrôleur pour les routes commençant par /cv
@Controller("cv")
export class CvController {
  // Injection du service CvService
  constructor(private cvService: CvService) {}

  // GET /cv : retourne tous les CV de l'utilisateur connecté
  @Get()
  @UseGuards(JwtAuthGuard) // Protège la route par authentification JWT
  async getAllCvs(@User() user): Promise<CvEntity[]> {
    return await this.cvService.getCvs(user);
  }

  // POST /cv : ajoute un nouveau CV pour l'utilisateur connecté
  @Post()
  @UseGuards(JwtAuthGuard)
  async addCv(@Body() AddCvDto: AddCvDto, @User() user): Promise<CvEntity> {
    return await this.cvService.addCv(AddCvDto, user);
  }

  // PATCH /cv : met à jour un ou plusieurs CV selon un critère personnalisé
  @Patch()
  @UseGuards(JwtAuthGuard)
  updateCv2(
    @Body() updateObject, // Contient { updateCriteria, updateCvDto }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @User() user,
  ) {
    const { updateCriteria, updateCvDto } = updateObject;
    return this.cvService.updateCv2(updateCriteria, updateCvDto);
  }

  // GET /cv/stats : retourne des statistiques de CV selon les tranches d’âge
  @Get("stats")
  @UseGuards(JwtAuthGuard)
  async statsCvNumberByAge() {
    return await this.cvService.statCvNumberByAge(50, 18);
  }

  // GET /cv/:id : retourne un CV spécifique par son ID
  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async getCv(@Param("id", ParseIntPipe) id: number, @User() user: UserEntity): Promise<CvEntity> {
    return await this.cvService.findCvById(id, user);
  }

  // DELETE /cv/soft-delete/:id : suppression logique d’un CV (soft delete)
  @Delete("soft-delete/:id")
  @UseGuards(JwtAuthGuard)
  softDeleteCv(@Param("id", ParseIntPipe) id: number, @User() user: UserEntity) {
    return this.cvService.softDeleteCv(id, user);
  }

  // GET /cv/recover/:id : restauration d’un CV supprimé logiquement
  @Get("recover/:id")
  @UseGuards(JwtAuthGuard)
  async restoreCv(@Param("id", ParseIntPipe) id: number, @User() user) {
    return await this.cvService.restoreCv(id, user);
  }

  // DELETE /cv/:id : suppression définitive d’un CV
  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async deleteCv(@Param("id", ParseIntPipe) id: number, @User() user: UserEntity) {
    return await this.cvService.removeCv(id, user);
  }

  // PATCH /cv/:id : mise à jour partielle d’un CV existant par son ID
  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async updateCv(
    @Body() UpdateCvDto: UpdateCvDto,
    @Param("id", ParseIntPipe) id: number,
    @User() user,
  ): Promise<CvEntity> {
    return await this.cvService.updateCv(id, UpdateCvDto, user);
  }
}
