/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository, IsNull } from "typeorm";
import { CvEntity } from "./entities/cv.entity/cv.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { AddCvDto } from "./dto/Add-cv.dto";
import { UpdateCvDto } from "./dto/update-cv.dto";
import { UserEntity } from "src/user/entites/user.entity/user.entity";
import { UserRoleEnum } from "src/enums/user-role.enum";
import { UserService } from "src/user/user.service";

// Service contenant la logique métier liée aux CV (ajout, mise à jour, suppression, récupération, stats...)
@Injectable()
export class CvService {
  constructor(
    @InjectRepository(CvEntity)
    private cvRepository: Repository<CvEntity>, // Repository injecté pour interagir avec la table des CV
    private userService: UserService, // Service utilisateur utilisé pour les vérifications de rôles et permissions
  ) {}

  // Récupérer un CV par son ID avec vérification de l'existence, suppression logique, et autorisation d'accès
  async findCvById(id: number, user: UserEntity): Promise<CvEntity> {
    const cv = await this.cvRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ["user"],
    });

    if (!cv) {
      throw new NotFoundException(`Le CV avec l'id ${id} n'existe pas`);
    }

    if (!this.userService.isOwnerOrAdmin(cv, user)) {
      throw new ForbiddenException("Accès interdit à ce CV");
    }

    return cv;
  }

  // Récupérer la liste des CV accessibles par l'utilisateur : tous si admin, sinon seulement les siens
  async getCvs(user: UserEntity): Promise<CvEntity[]> {
    if (user.role === UserRoleEnum.ADMIN) {
      return await this.cvRepository.find({
        relations: ["user"],
        where: { deletedAt: IsNull() },
      });
    }

    return await this.cvRepository
      .createQueryBuilder("cv")
      .leftJoinAndSelect("cv.user", "user")
      .where("user.id = :userId", { userId: user.id })
      .andWhere("cv.deletedAt IS NULL")
      .getMany();
  }

  // Ajouter un nouveau CV associé à l'utilisateur connecté
  async addCv(addCvDto: AddCvDto, user: UserEntity): Promise<CvEntity> {
    const cv = this.cvRepository.create(addCvDto);
    cv.user = user;
    return await this.cvRepository.save(cv);
  }

  // Mettre à jour un CV existant après vérification d'autorisation
  async updateCv(id: number, cvDto: UpdateCvDto, user: UserEntity): Promise<CvEntity> {
    const cv = await this.findCvById(id, user);
    const updatedCv = this.cvRepository.merge(cv, cvDto);
    return await this.cvRepository.save(updatedCv);
  }

  // Mettre à jour un ou plusieurs CV en se basant sur des critères génériques (sans vérification utilisateur)
  async updateCv2(updateCriteria: any, cv: UpdateCvDto): Promise<CvEntity | null> {
    await this.cvRepository.update(updateCriteria, cv);
    return this.cvRepository.findOneBy(updateCriteria);
  }

  // Supprimer définitivement un CV après vérification d'autorisation
  async removeCv(id: number, user: UserEntity) {
    const cvToRemove = await this.findCvById(id, user);
    return await this.cvRepository.remove(cvToRemove);
  }

  // Effectuer une suppression logique d’un CV (soft delete), avec vérification d’autorisation
  async softDeleteCv(id: number, user: UserEntity) {
    const cv = await this.cvRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ["user"],
    });

    if (!cv) {
      throw new NotFoundException(`Le CV avec l'id ${id} n'existe pas`);
    }

    if (!this.userService.isOwnerOrAdmin(cv, user)) {
      throw new ForbiddenException("Accès interdit à ce CV");
    }

    return this.cvRepository.softDelete(id);
  }

  // Restaurer un CV précédemment supprimé (soft delete), avec vérification d’autorisation
  async restoreCv(id: number, user: UserEntity) {
    const cv = await this.cvRepository.findOne({
      where: { id },
      withDeleted: true,
      relations: ["user"],
    });

    if (!cv) {
      throw new NotFoundException(`Le CV avec l'id ${id} n'existe pas`);
    }

    if (!this.userService.isOwnerOrAdmin(cv, user)) {
      throw new ForbiddenException("Accès interdit à ce CV");
    }

    await this.cvRepository.restore(id);

    return this.cvRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ["user"],
    });
  }

  // Supprimer un CV sans vérification utilisateur — à éviter dans un contexte sécurisé
  async deleteCv(id: number) {
    return await this.cvRepository.delete(id);
  }

  // Statistiques : nombre de CV groupés par âge dans un intervalle donné
  async statCvNumberByAge(maxAge: number, minAge: number = 0) {
    const qb = this.cvRepository.createQueryBuilder("cv");
    qb.select("cv.age, count(cv.id) as nombreDeCv")
      .groupBy("cv.age")
      .where("cv.age > :minAge and cv.age < :maxAge")
      .andWhere("cv.deletedAt IS NULL")
      .setParameters({ minAge, maxAge });

    return await qb.getRawMany();
  }
}
